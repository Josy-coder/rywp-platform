import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { getPermissions } from "./auth";
import { internal } from "./_generated/api";

export const getPublications = query({
  args: {
    type: v.optional(v.union(
      v.literal("policy_brief"),
      v.literal("article"),
      v.literal("blog_post"),
      v.literal("press_release"),
      v.literal("technical_report")
    )),
    status: v.optional(v.union(v.literal("draft"), v.literal("pending"), v.literal("published"))),
    authorId: v.optional(v.id("users")),
  },
  handler: async (ctx, { type, status, authorId }) => {
    let publications;

    if (type) {
      publications = await ctx.db
        .query("publications")
        .withIndex("by_type", (q) => q.eq("type", type))
        .collect();
    } else if (status) {
      publications = await ctx.db
        .query("publications")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect();
    } else if (authorId) {
      publications = await ctx.db
        .query("publications")
        .withIndex("by_author", (q) => q.eq("authorId", authorId))
        .collect();
    } else {
      publications = await ctx.db
        .query("publications")
        .collect();
    }

    if (type && status) {
      publications = publications.filter(pub => pub.status === status);
    }
    if (type && authorId) {
      publications = publications.filter(pub => pub.authorId === authorId);
    }
    if (status && authorId && !type) {
      publications = publications.filter(pub => pub.authorId === authorId);
    }

    const enrichedPublications = await Promise.all(
      publications.map(async (pub) => {
        const author = await ctx.db.get(pub.authorId);
        const approver = pub.approvedBy ? await ctx.db.get(pub.approvedBy) : null;

        const attachmentUrls = await Promise.all(
          pub.attachments.map(async (attachmentId) => 
            await ctx.storage.getUrl(attachmentId)
          )
        );

        return {
          ...pub,
          featuredImageId: pub.featuredImage,
          featuredImage: pub.featuredImage ? await ctx.storage.getUrl(pub.featuredImage) : null,
          attachmentIds: pub.attachments,
          attachments: attachmentUrls,
          author: author ? {
            ...author,
            profileImageId: author.profileImage,
            profileImage: author.profileImage ? await ctx.storage.getUrl(author.profileImage) : null,
          } : null,
          approver: approver ? {
            ...approver,
            profileImage: approver.profileImage ? await ctx.storage.getUrl(approver.profileImage) : null,
          } : null,
        };
      })
    );

    return { data: enrichedPublications };
  },
});

export const getPublication = query({
  args: { publicationId: v.id("publications") },
  handler: async (ctx, { publicationId }) => {
    const publication = await ctx.db.get(publicationId);
    if (!publication) return { error: "Publication not found" };

    const author = await ctx.db.get(publication.authorId);
    const approver = publication.approvedBy ? await ctx.db.get(publication.approvedBy) : null;

    const attachmentUrls = await Promise.all(
      publication.attachments.map(async (attachmentId) => 
        await ctx.storage.getUrl(attachmentId)
      )
    );

    return {
      data: {
        ...publication,
        featuredImageId: publication.featuredImage,
        featuredImage: publication.featuredImage ? await ctx.storage.getUrl(publication.featuredImage) : null,
        attachmentIds: publication.attachments,
        attachments: attachmentUrls,
        author: author ? {
          ...author,
          profileImage: author.profileImage ? await ctx.storage.getUrl(author.profileImage) : null,
        } : null,
        approver: approver ? {
          ...approver,
          profileImage: approver.profileImage ? await ctx.storage.getUrl(approver.profileImage) : null,
        } : null,
      }
    };
  },
});

export const getPublishedPublications = query({
  args: {
    type: v.optional(v.union(
      v.literal("policy_brief"),
      v.literal("article"),
      v.literal("blog_post"),
      v.literal("press_release"),
      v.literal("technical_report")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { type, limit }) => {
    let query = ctx.db.query("publications")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc");

    if (type) {
      query = query.filter((q) => q.eq(q.field("type"), type));
    }

    const publications = await query.collect();
    const limitedResults = limit ? publications.slice(0, limit) : publications;

    const enrichedPublications = await Promise.all(
      limitedResults.map(async (pub) => {
        const author = await ctx.db.get(pub.authorId);
        
        const attachmentUrls = await Promise.all(
          pub.attachments.map(async (attachmentId) => 
            await ctx.storage.getUrl(attachmentId)
          )
        );
        
        return { 
          ...pub, 
          featuredImageId: pub.featuredImage,
          featuredImage: pub.featuredImage ? await ctx.storage.getUrl(pub.featuredImage) : null,
          attachmentIds: pub.attachments,
          attachments: attachmentUrls,
          author: author ? {
            ...author,
            profileImageId: author.profileImage,
            profileImage: author.profileImage ? await ctx.storage.getUrl(author.profileImage) : null,
          } : null,
        };
      })
    );

    return { data: enrichedPublications };
  },
});

export const createPublication = mutation({
  args: {
    token: v.string(),
    title: v.string(),
    content: v.string(),
    type: v.union(
      v.literal("policy_brief"),
      v.literal("article"),
      v.literal("blog_post"),
      v.literal("press_release"),
      v.literal("technical_report")
    ),
    featuredImage: v.optional(v.id("_storage")),
    attachments: v.optional(v.array(v.id("_storage"))),
    tags: v.optional(v.array(v.string())),
    isRestrictedAccess: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const permissions = await getPermissions(ctx, args.token);
    if (!permissions) return { error: "Not authenticated" };

    const canCreate = permissions.user.globalRole === "member" ?
      ["blog_post", "article"].includes(args.type) :
      permissions.isGlobalAdmin();

    if (!canCreate) {
      return { error: "Insufficient permissions for this publication type" };
    }

    try {
      const publicationId = await ctx.db.insert("publications", {
        ...args,
        authorId: permissions.user._id,
        status: permissions.isGlobalAdmin() ? "published" : "pending",
        attachments: args.attachments || [],
        tags: args.tags || [],
        isRestrictedAccess: args.isRestrictedAccess || false,
        createdAt: Date.now(),
        ...(permissions.isGlobalAdmin() && {
          publishedAt: Date.now(),
          approvedBy: permissions.user._id,
        }),
      });

      return { success: true, publicationId };
    } catch (error) {
      console.error("Error creating publication:", error);
      return { error: "Failed to create publication" };
    }
  },
});

export const updatePublication = mutation({
  args: {
    token: v.string(),
    publicationId: v.id("publications"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    type: v.optional(v.union(
      v.literal("policy_brief"),
      v.literal("article"),
      v.literal("blog_post"),
      v.literal("press_release"),
      v.literal("technical_report")
    )),
    featuredImage: v.optional(v.id("_storage")),
    attachments: v.optional(v.array(v.id("_storage"))),
    tags: v.optional(v.array(v.string())),
    isRestrictedAccess: v.optional(v.boolean()),
    status: v.optional(v.union(v.literal("draft"), v.literal("pending"), v.literal("published"))),
  },
  handler: async (ctx, { publicationId, token, ...updates }) => {
    const permissions = await getPermissions(ctx, token);
    if (!permissions) return { error: "Not authenticated" };

    const publication = await ctx.db.get(publicationId);
    if (!publication) return { error: "Publication not found" };

    const isAuthor = publication.authorId === permissions.user._id;
    const isAdmin = permissions.isGlobalAdmin();

    if (!isAuthor && !isAdmin) {
      return { error: "Insufficient permissions" };
    }

    if (updates.status === "published" && !isAdmin) {
      return { error: "Only admins can publish publications" };
    }

    try {

      const updateData: any = { ...updates };

      if (updates.featuredImage && publication.featuredImage && updates.featuredImage !== publication.featuredImage) {
        try {
          await ctx.storage.delete(publication.featuredImage);
        } catch (error) {
          console.warn("Failed to delete old featured image:", error);
        }
      }

      if (updates.attachments && publication.attachments) {
        const oldAttachments = publication.attachments;
        const newAttachments = updates.attachments;
        const attachmentsToDelete = oldAttachments.filter(id => !newAttachments.includes(id));

        for (const attachmentId of attachmentsToDelete) {
          try {
            await ctx.storage.delete(attachmentId);
          } catch (error) {
            console.warn("Failed to delete old attachment:", error);
          }
        }
      }

      if (updates.status === "published" && publication.status !== "published") {
        updateData.publishedAt = Date.now();
        updateData.approvedBy = permissions.user._id;
      }

      await ctx.db.patch(publicationId, updateData);
      return { success: true };
    } catch (error) {
      console.error("Error updating publication:", error);
      return { error: "Failed to update publication" };
    }
  },
});


export const reviewPublication = mutation({
  args: {
    token: v.string(),
    publicationId: v.id("publications"),
    status: v.union(v.literal("published"), v.literal("rejected")),
  },
  handler: async (ctx, { publicationId, status, token }) => {
    const permissions = await getPermissions(ctx, token);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    try {
      const updates: any = {
        status,
        approvedBy: permissions.user._id,
      };

      if (status === "published") {
        updates.publishedAt = Date.now();
      }

      await ctx.db.patch(publicationId, updates);
      return { success: true };
    } catch (error) {
      console.error("Failed to review publication:", error);
      return { error: "Failed to review publication" };
    }
  },
});

export const requestPublicationAccess = mutation({
  args: {
    publicationId: v.id("publications"),
    requesterName: v.string(),
    requesterEmail: v.string(),
    requesterOrganization: v.optional(v.string()),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const publication = await ctx.db.get(args.publicationId);
      if (!publication || !publication.isRestrictedAccess) {
        return { error: "Publication not found or not restricted" };
      }

      const existing = await ctx.db
        .query("publicationAccessRequests")
        .withIndex("by_publication", (q) => q.eq("publicationId", args.publicationId))
        .filter((q) => q.eq(q.field("requesterEmail"), args.requesterEmail))
        .first();

      if (existing) {
        return { error: "Access already requested" };
      }

      await ctx.db.insert("publicationAccessRequests", {
        ...args,
        status: "pending",
        requestedAt: Date.now(),
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to submit access request:", error);
      return { error: "Failed to submit access request" };
    }
  },
});

export const reviewPublicationAccessRequest = mutation({
  args: {
    token: v.string(),
    requestId: v.id("publicationAccessRequests"),
    status: v.union(v.literal("approved"), v.literal("denied")),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, { requestId, status, reason, token }) => {
    const permissions = await getPermissions(ctx, token);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    try {
      const request = await ctx.db.get(requestId);
      if (!request) return { error: "Request not found" };

      const publication = await ctx.db.get(request.publicationId);
      if (!publication) return { error: "Publication not found" };

      await ctx.db.patch(requestId, {
        status,
        reviewedBy: permissions.user._id,
        reviewedAt: Date.now(),
      });

      await ctx.scheduler.runAfter(0, internal.emails.sendTechnicalReportAccessEmail, {
        to: request.requesterEmail,
        name: request.requesterName,
        publicationTitle: publication.title,
        status,
        reason,

        accessLink: status === "approved" ? `${process.env.SITE_URL}/publications/${publication._id}?access=granted` : undefined,
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to review access request:", error);
      return { error: "Failed to review access request" };
    }
  },
});

export const deletePublication = mutation({
  args: {
    publicationId: v.id("publications"),
    token: v.string(),
  },
  handler: async (ctx, { publicationId, token }) => {
    const permissions = await getPermissions(ctx, token);
    if (!permissions) return { error: "Not authenticated" };

    const publication = await ctx.db.get(publicationId);
    if (!publication) return { error: "Publication not found" };

    const isAuthor = publication.authorId === permissions.user._id;
    const isAdmin = permissions.isGlobalAdmin();

    if (!isAuthor && !isAdmin) {
      return { error: "Insufficient permissions" };
    }

    try {

      if (publication.featuredImage) {
        try {
          await ctx.storage.delete(publication.featuredImage);
        } catch (error) {
          console.warn("Failed to delete featured image:", error);
        }
      }

      if (publication.attachments && publication.attachments.length > 0) {
        for (const attachmentId of publication.attachments) {
          try {
            await ctx.storage.delete(attachmentId);
          } catch (error) {
            console.warn("Failed to delete attachment:", error);
          }
        }
      }

      const accessRequests = await ctx.db
        .query("publicationAccessRequests")
        .withIndex("by_publication", (q) => q.eq("publicationId", publicationId))
        .collect();

      for (const request of accessRequests) {
        await ctx.db.delete(request._id);
      }

      const accessTokens = await ctx.db
        .query("publicationAccessTokens")
        .filter((q) => q.eq(q.field("publicationId"), publicationId))
        .collect();

      for (const token of accessTokens) {
        await ctx.db.delete(token._id);
      }

      await ctx.db.delete(publicationId);

      return { success: true };
    } catch (error) {
      console.error("Error deleting publication:", error);
      return { error: "Failed to delete publication" };
    }
  },
});

export const getPublicationAccessRequests = query({
  args: {
    token: v.string(),
    status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("denied"))),
  },
  handler: async (ctx, { token, status }) => {
    const permissions = await getPermissions(ctx, token);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    let requests;
    if (status) {
      requests = await ctx.db
        .query("publicationAccessRequests")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect();
    } else {
      requests = await ctx.db
        .query("publicationAccessRequests")
        .collect();
    }

    const enrichedRequests = await Promise.all(
      requests.map(async (request) => {
        const publication = await ctx.db.get(request.publicationId);
        const reviewer = request.reviewedBy ? await ctx.db.get(request.reviewedBy) : null;

        return {
          ...request,
          publication,
          reviewer,
        };
      })
    );

    return { data: enrichedRequests };
  },
});

export const cleanupExpiredTokens = internalMutation(async (ctx) => {
  const expiredTokens = await ctx.db
    .query("publicationAccessTokens")
    .withIndex("by_expiry", (q) => q.lt("expiresAt", Date.now()))
    .collect();

  for (const token of expiredTokens) {
    await ctx.db.delete(token._id);
  }

  return { success: true, deletedCount: expiredTokens.length };
});