import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getPermissions } from "./auth";
import { internal } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";
import { Id } from "./_generated/dataModel";

export const getHubs = query({
  args: { activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, { activeOnly = true }) => {
    let query = ctx.db.query("hubs");

    if (activeOnly) {
      query = query.filter((q) => q.eq(q.field("isActive"), true));
    }

    const hubs = await query.collect();

    const hubsWithCounts = await Promise.all(
      hubs.map(async (hub) => {
        const memberCount = await ctx.db
          .query("hubMemberships")
          .withIndex("by_hub", (q) => q.eq("hubId", hub._id))
          .filter((q) => q.eq(q.field("status"), "approved"))
          .collect()
          .then(members => members.length);

        return { 
          ...hub, 
          memberCount,
          image: hub.image ? await ctx.storage.getUrl(hub.image) : null,
          termsOfReference: hub.termsOfReference ? await ctx.storage.getUrl(hub.termsOfReference) : null,
        };
      })
    );

    return { data: hubsWithCounts };
  },
});

export const getHub = query({
  args: { hubId: v.id("hubs") },
  handler: async (ctx, { hubId }) => {
    const hub = await ctx.db.get(hubId);
    if (!hub) return { error: "Hub not found" };

    const members = await ctx.db
      .query("hubMemberships")
      .withIndex("by_hub", (q) => q.eq("hubId", hubId))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .collect();

    const membersWithUsers = await Promise.all(
      members.map(async (membership) => {
        const user = await ctx.db.get(membership.userId);
        return { 
          ...membership, 
          user: user ? {
            ...user,
            profileImage: user.profileImage ? await ctx.storage.getUrl(user.profileImage) : null,
          } : null,
        };
      })
    );

    return { 
      data: { 
        ...hub, 
        image: hub.image ? await ctx.storage.getUrl(hub.image) : null,
        termsOfReference: hub.termsOfReference ? await ctx.storage.getUrl(hub.termsOfReference) : null,
        members: membersWithUsers 
      } 
    };
  },
});

export const createHub = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    description: v.string(),
    objectives: v.string(),
    membershipFormFields: v.array(v.any()),
    image: v.optional(v.id("_storage")),
    termsOfReference: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const permissions = await getPermissions(ctx, args.token);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    try {
      const hubId = await ctx.db.insert("hubs", {
        name: args.name,
        description: args.description,
        objectives: args.objectives,
        membershipFormFields: args.membershipFormFields,
        image: args.image,
        termsOfReference: args.termsOfReference,
        isActive: true,
        createdAt: Date.now(),
        createdBy: permissions.user._id,
      });

      return { success: true, hubId };
    } catch (error) {
      console.error("Failed to create hub:", error);
      return { error: "Failed to create hub" };
    }
  },
});

export const updateHub = mutation({
  args: {
    hubId: v.id("hubs"),
    token: v.string(),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    objectives: v.optional(v.string()),
    membershipFormFields: v.optional(v.array(v.any())),
    image: v.optional(v.id("_storage")),
    termsOfReference: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { hubId, token, ...updates }) => {
    const permissions = await getPermissions(ctx, token);
    if (!permissions?.canManageHub(hubId)) {
      return { error: "Insufficient permissions" };
    }

    try {
      await ctx.db.patch(hubId, updates);
      return { success: true };
    } catch (error) {
      console.error("Failed to update hub:", error);
      return { error: "Failed to update hub" };
    }
  },
});

export const applyToHub = mutation({
  args: {
    hubId: v.id("hubs"),
    applicationData: v.object({}),
    token: v.string(),
  },
  handler: async (ctx, { hubId, applicationData, token }) => {
    const permissions = await getPermissions(ctx, token);
    if (!permissions || !permissions.user) {
      return { error: "Must be an organization member to apply to hubs" };
    }

    if (permissions.hubMemberships.length > 0) {
      return { error: "You are already a member of another hub" };
    }


    const existing = await ctx.db
      .query("hubMemberships")
      .withIndex("by_user_hub", (q) => q.eq("userId", permissions.user._id).eq("hubId", hubId))
      .unique();

    if (existing) {
      return { error: "Already applied or member of this hub" };
    }

    try {
      const hub = await ctx.db.get(hubId);
      if (!hub) return { error: "Hub not found" };

      await ctx.db.insert("hubMemberships", {
        userId: permissions.user._id,
        hubId,
        role: "member",
        applicationData,
        formSnapshot: hub.membershipFormFields,
        status: "pending",
        submittedAt: Date.now(),
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to submit application:", error);
      return { error: "Failed to submit application" };
    }
  },
});

export const reviewHubApplication = mutation({
  args: {
    applicationId: v.id("hubMemberships"),
    status: v.union(v.literal("approved"), v.literal("rejected")),
    notes: v.optional(v.string()),
    token: v.string()
  },
  handler: async (ctx, { applicationId, status, notes, token }) => {

    const permissions = await getPermissions(ctx, token);
    if (!permissions) return { error: "Not authenticated" };

    const application = await ctx.db.get(applicationId);
    if (!application) return { error: "Application not found" };

    if (!permissions.canManageHub(application.hubId)) {
      return { error: "Insufficient permissions" };
    }

    try {

      await ctx.db.patch(applicationId, {
        status,
        notes,
        reviewedBy: permissions.user._id,
        reviewedAt: Date.now(),
      });

      const user = await ctx.db.get(application.userId);
      const hub = await ctx.db.get(application.hubId);

      if (user && hub) {
        await ctx.scheduler.runAfter(0, internal.emails.sendHubApplicationNotification,{
          to: user.email!,
          name: user.name!,
          hubName: hub.name,
          status,
          notes,
        });
      }

      return { success: true };

    } catch (error) {

      console.error("Failed to review application:", error);
      return { error: "Failed to review application" };
    }
  },
});

export const getHubApplications = query({
  args: {
    paginationOpts: paginationOptsValidator,
    hubId: v.id("hubs"),
    status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
    search: v.optional(v.string()),
    token: v.string(),
  },
  handler: async (ctx, { paginationOpts, hubId, status, search, token }) => {
    const permissions = await getPermissions(ctx, token);
    if (!permissions?.isGlobalAdmin() && !permissions?.canManageHub(hubId)) {
      return { error: "Insufficient permissions" };
    }

    let query = ctx.db
      .query("hubMemberships")
      .withIndex("by_hub", (q) => q.eq("hubId", hubId));

    if (status) {
      query = query.filter((q) => q.eq(q.field("status"), status));
    }

    if (search && search.trim()) {
      const searchTerm = search.toLowerCase().trim();

      const allUsers = await ctx.db.query("users").collect();
      const matchingUserIds: Set<Id<"users">> = new Set();

      allUsers.forEach(user => {
        if (user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)) {
          matchingUserIds.add(user._id);
        }
      });

      query = query.filter((q) => {
        return Array.from(matchingUserIds).some(userId =>
          q.eq(q.field("userId"), userId)
        );
      });
    }

    const result = await query.order("desc").paginate(paginationOpts);

    const enrichedApplications = await Promise.all(
      result.page.map(async (app) => {
        const [user, hub, reviewer] = await Promise.all([
          ctx.db.get(app.userId),
          ctx.db.get(app.hubId),
          app.reviewedBy ? ctx.db.get(app.reviewedBy) : null
        ]);
        return { ...app, user, hub, reviewer };
      })
    );

    return {
      ...result,
      page: enrichedApplications,
    };
  },
});
