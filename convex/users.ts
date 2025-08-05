import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getPermissions } from "./auth";
import { Doc } from "./_generated/dataModel";

export const getCurrentUser = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const permissions = await getPermissions(ctx, args.token);
    if (!permissions || !permissions.user) {
      return { error: "Not authenticated" };
    }

    return await ctx.db.get(permissions.user._id);
  },
});

export const getUserHubMemberships = query({
  args: {
    userId: v.optional(v.id("users")),
    token: v.string(),
  },
  handler: async (ctx, { userId, token }) => {
    const permissions = await getPermissions(ctx, token);
    if (!permissions || !permissions.user) {
      return { error: "Not authenticated" };
    }

    const targetUserId = userId;

    let memberships: Doc<"hubMemberships">[] = [];

    if (targetUserId) {
      memberships = await ctx.db
        .query("hubMemberships")
        .withIndex("by_user", (q) => q.eq("userId", targetUserId))
        .filter((q) => q.eq(q.field("status"), "approved"))
        .collect();
    }

    const results = await Promise.all(
      memberships.map(async (membership) => {
        const hub = await ctx.db.get(membership.hubId);
        return { ...membership, hub };
      })
    );

    return { data: results };
  },
});

export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    token: v.string(),
    name: v.optional(v.string()),
    bio: v.optional(v.string()),
    position: v.optional(v.string()),
    profileImage: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const permissions = await getPermissions(ctx, args.token);
    if (!permissions || !permissions.user) {
      return { error: "Not authenticated" };
    }

    if ((permissions.user._id !== args.userId) && (!permissions.isSuperAdmin())) {
      return { error: "Insufficient permissions" };
    }

    try {
      await ctx.db.patch(args.userId, args);
      return { success: true };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { error: "Failed to update profile" };
    }
  },
});

export const getTeamMembers = query({
  args: {
    category: v.union(
      v.literal("founding"),
      v.literal("hub_management"),
      v.literal("staff"),
      v.literal("all")
    ),
    isPublicTeamMember: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {

    let membersQuery = ctx.db.query("users").withIndex("by_team_category");

    if (args.category !== "all") {
      membersQuery = membersQuery.filter(q => q.eq(q.field("teamCategory"), args.category));
    }

    if (args.isPublicTeamMember !== undefined) {
      membersQuery = membersQuery.filter(q =>
        q.eq(q.field("isPublicTeamMember"), args.isPublicTeamMember)
      );
    }

    membersQuery = membersQuery.filter(q => q.eq(q.field("isActive"), true));

    const members = await membersQuery.collect();

    if (args.category === "all") {
      const grouped = {
        founding: members.filter(m => m.teamCategory === "founding"),
        hub_management: members.filter(m => m.teamCategory === "hub_management"),
        staff: members.filter(m => m.teamCategory === "staff"),
      };
      return { data: grouped };
    }

    return { data: members };
  },
});

export const promoteUser = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("member")),
    temporaryUntil: v.optional(v.number()),
    token: v.string(),
  },
  handler: async (ctx, { userId, role, temporaryUntil, token }) => {
    const permissions = await getPermissions(ctx, token);
    if (!permissions || !permissions.user) {
      return { error: "Not authenticated" };
    }
    if (!permissions.isSuperAdmin()) {
      return { error: "Insufficient permissions" };
    }

    try {
      const updates: any = { globalRole: role };
      if (temporaryUntil) {
        updates.temporaryAdminUntil = temporaryUntil;
      }

      await ctx.db.patch(userId, updates);
      return { success: true };
    } catch (error) {
      console.error("Error promoting user:", error);
      return { error: "Failed to update user role" };
    }
  },
});