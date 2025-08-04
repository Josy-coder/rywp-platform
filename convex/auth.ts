import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { QueryCtx, MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { DataModel } from "./_generated/dataModel";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password<DataModel>()],
  callbacks: {
    async createOrUpdateUser(ctx, args) {

      if (args.existingUserId) {
        return args.existingUserId;
      }

      const userId = await ctx.db.insert("users", {
        name: args.profile.name || "",
        email: args.profile.email || "",
        globalRole: "member", // Default role for new signups
        isActive: true,
        joinedAt: Date.now(),

      });

      return userId;
    },
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
