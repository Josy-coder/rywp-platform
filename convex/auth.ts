import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { QueryCtx, MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { DataModel } from "./_generated/dataModel";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password<DataModel>()],
  callbacks: {
    async createOrUpdateUser(ctx, args) {

      if (args.existingUserId) {
        return args.existingUserId;
      }


      const existingUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), args.profile.email))
        .first();

      if (!existingUser) {

        throw new Error("Account not found. Please apply for membership first or contact an administrator.");
      }

      if (!existingUser.isActive) {
        throw new Error("Your account has been deactivated. Please contact an administrator.");
      }

      return existingUser._id;
    },
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    const hubMemberships = await ctx.db
      .query("hubMemberships")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .collect();

    const enrichedMemberships = await Promise.all(
      hubMemberships.map(async (membership) => {
        const hub = await ctx.db.get(membership.hubId);
        return { ...membership, hub };
      })
    );

    return {
      ...user,
      hubMemberships: enrichedMemberships,
      isGlobalAdmin: user.globalRole === "admin" ||
        user.globalRole === "superadmin" ||
        (user.temporaryAdminUntil && user.temporaryAdminUntil > Date.now()),
      isSuperAdmin: user.globalRole === "superadmin",
      hasTemporaryAdmin: user.temporaryAdminUntil && user.temporaryAdminUntil > Date.now(),
    };
  },
});

export async function getPermissions(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) return null;

  const user = await ctx.db.get(userId);
  if (!user) return null;

  const hubMemberships = await ctx.db
    .query("hubMemberships")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .filter((q) => q.eq(q.field("status"), "approved"))
    .collect();

  return {
    user,
    hubMemberships,
    isGlobalAdmin: () => {
      return user.globalRole === "admin" ||
        user.globalRole === "superadmin" ||
        (user.temporaryAdminUntil && user.temporaryAdminUntil > Date.now());
    },
    isSuperAdmin: () => user.globalRole === "superadmin",
    isHubLead: (hubId: string) => hubMemberships.some(m => m.hubId === hubId && m.role === "lead"),
    isMemberOfHub: (hubId: string) => hubMemberships.some(m => m.hubId === hubId),
    canManageHub: (hubId: string) => {
      return user.globalRole === "admin" ||
        user.globalRole === "superadmin" ||
        (user.temporaryAdminUntil && user.temporaryAdminUntil > Date.now()) ||
        hubMemberships.some(m => m.hubId === hubId && m.role === "lead");
    }
  };
}

export const createAdminUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    globalRole: v.union(v.literal("admin"), v.literal("superadmin")),
    temporaryAdminUntil: v.optional(v.number()),
  },
  handler: async (ctx, args) => {

    const permissions = await getPermissions(ctx);
    if (!permissions?.isSuperAdmin()) {
      return { error: "Only superadmins can create admin users" };
    }

    try {

      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();

      if (existingUser) {
        return { error: "User with this email already exists" };
      }

      const userId = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        globalRole: args.globalRole,
        temporaryAdminUntil: args.temporaryAdminUntil,
        isActive: true,
        joinedAt: Date.now(),
      });

      return { success: true, userId };
    } catch (error) {
      console.error("Failed to create admin user:", error);
      return { error: "Failed to create admin user" };
    }
  },
});

export const grantTemporaryAdminAccess = mutation({
  args: {
    userId: v.id("users"),
    temporaryAdminUntil: v.number(),
  },
  handler: async (ctx, args) => {
    const permissions = await getPermissions(ctx);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    try {
      await ctx.db.patch(args.userId, {
        temporaryAdminUntil: args.temporaryAdminUntil,
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to grant temporary admin access:", error);
      return { error: "Failed to grant temporary admin access" };
    }
  },
});

export const revokeTemporaryAdminAccess = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const permissions = await getPermissions(ctx);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    try {
      await ctx.db.patch(args.userId, {
        temporaryAdminUntil: undefined,
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to revoke temporary admin access:", error);
      return { error: "Failed to revoke temporary admin access" };
    }
  },
});