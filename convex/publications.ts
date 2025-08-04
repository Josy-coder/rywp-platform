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

        return {
          ...pub,
          author,
          approver,
        };
      })
    );

    return { data: enrichedPublications };
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
        return { ...pub, author };
      })
    );

    return { data: enrichedPublications };
  },
});

export const createPublication = mutation({
  args: {
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
    const permissions = await getPermissions(ctx);
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

export const reviewPublication = mutation({
  args: {
    publicationId: v.id("publications"),
    status: v.union(v.literal("published"), v.literal("rejected")),
  },
  handler: async (ctx, { publicationId, status }) => {
    const permissions = await getPermissions(ctx);
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
    requestId: v.id("publicationAccessRequests"),
    status: v.union(v.literal("approved"), v.literal("denied")),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, { requestId, status, reason }) => {
    const permissions = await getPermissions(ctx);
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