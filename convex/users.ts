import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get current user with full details
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db.get(userId);
  },
});

// Get user's hub memberships
export const getUserHubMemberships = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, { userId }) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) return { error: "Not authenticated" };

    const targetUserId = userId || currentUserId;

    const memberships = await ctx.db
      .query("hubMemberships")
      .withIndex("by_user", (q) => q.eq("userId", targetUserId))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .collect();

    const results = await Promise.all(
      memberships.map(async (membership) => {
        const hub = await ctx.db.get(membership.hubId);
        return { ...membership, hub };
      })
    );

    return { data: results };
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    bio: v.optional(v.string()),
    position: v.optional(v.string()),
    profileImage: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { error: "Not authenticated" };

    try {
      await ctx.db.patch(userId, args);
      return { success: true };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { error: "Failed to update profile" };
    }
  },
});

// Get team members for About Us page
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
    // Start the query on the "users" collection
    let membersQuery = ctx.db.query("users").withIndex("by_team_category");

    // Apply filter based on `category` if it's not "all"
    if (args.category !== "all") {
      membersQuery = membersQuery.filter(q => q.eq(q.field("teamCategory"), args.category));
    }

    // Apply `isPublicTeamMember` filter if it's provided
    if (args.isPublicTeamMember !== undefined) {
      membersQuery = membersQuery.filter(q =>
        q.eq(q.field("isPublicTeamMember"), args.isPublicTeamMember)
      );
    }

    // Always filter by active status
    membersQuery = membersQuery.filter(q => q.eq(q.field("isActive"), true));

    // Collect the results
    const members = await membersQuery.collect();

    // Group by category if "all" is selected
    if (args.category === "all") {
      const grouped = {
        founding: members.filter(m => m.teamCategory === "founding"),
        hub_management: members.filter(m => m.teamCategory === "hub_management"),
        staff: members.filter(m => m.teamCategory === "staff"),
      };
      return { data: grouped };
    }

    // Return filtered results
    return { data: members };
  },
});

// Admin functions
export const promoteUser = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("member")),
    temporaryUntil: v.optional(v.number()),
  },
  handler: async (ctx, { userId, role, temporaryUntil }) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) return { error: "Not authenticated" };

    const currentUser = await ctx.db.get(currentUserId);
    if (!currentUser || currentUser.globalRole !== "superadmin") {
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