import { mutation, query } from "./_generated/server";
import { getPermissions } from "./auth";
import { v } from "convex/values";

export const getPartners = query({
  args: { activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, { activeOnly = true }) => {
    let query = ctx.db.query("partners");

    if (activeOnly) {
      query = query.filter((q) => q.eq(q.field("isActive"), true));
    }

    const partners = await query.collect();
    return { data: partners };
  },
});

export const createPartner = mutation({
  args: {
    name: v.string(),
    website: v.optional(v.string()),
    logo: v.optional(v.id("_storage")),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const permissions = await getPermissions(ctx);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    try {
      const partnerId = await ctx.db.insert("partners", {
        ...args,
        isActive: true,
        createdAt: Date.now(),
        createdBy: permissions.user._id,
      });

      return { success: true, partnerId };
    } catch (error) {
      console.error("Error creating partner:", error);
      return { error: "Failed to create partner" };
    }
  },
});
