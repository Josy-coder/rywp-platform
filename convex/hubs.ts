import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getPermissions } from "./auth";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

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

        return { ...hub, memberCount };
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
        return { ...membership, user };
      })
    );

    return { data: { ...hub, members: membersWithUsers } };
  },
});

export const createHub = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    description: v.string(),
    objectives: v.string(),
    membershipFormFields: v.array(v.any()), // Using v.any() for complex form field schema
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
        ...args,
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
  },
  handler: async (ctx, { hubId, applicationData }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { error: "Not authenticated" };

    const user = await ctx.db.get(userId);
    if (!user || user.globalRole !== "member") {
      return { error: "Must be an organization member to apply to hubs" };
    }

    const existing = await ctx.db
      .query("hubMemberships")
      .withIndex("by_user_hub", (q) => q.eq("userId", userId).eq("hubId", hubId))
      .unique();

    if (existing) {
      return { error: "Already applied or member of this hub" };
    }

    try {
      const hub = await ctx.db.get(hubId);
      if (!hub) return { error: "Hub not found" };

      await ctx.db.insert("hubMemberships", {
        userId,
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
