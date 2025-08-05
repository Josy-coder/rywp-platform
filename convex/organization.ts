import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getPermissions } from "./auth";

export const getOrganizationInfo = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    const info = await ctx.db
      .query("organizationInfo")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();

    return info || null;
  },
});

export const getAllOrganizationInfo = query({
  args: {},
  handler: async (ctx) => {
    const allInfo = await ctx.db.query("organizationInfo").collect();

    // Convert to key-value object for easier frontend use
    const infoMap: Record<string, any> = {};
    allInfo.forEach(item => {
      infoMap[item.key] = {
        content: item.content,
        type: item.type,
        lastUpdatedAt: item.lastUpdatedAt
      };
    });

    return { data: infoMap };
  },
});

export const updateOrganizationInfo = mutation({
  args: {
    token: v.string(),
    key: v.string(),
    content: v.string(),
    type: v.union(v.literal("text"), v.literal("html"), v.literal("json")),
  },
  handler: async (ctx, { key, content, type, token }) => {
    const permissions = await getPermissions(ctx, token);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    try {
      const existing = await ctx.db
        .query("organizationInfo")
        .withIndex("by_key", (q) => q.eq("key", key))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, {
          content,
          type,
          lastUpdatedBy: permissions.user._id,
          lastUpdatedAt: Date.now(),
        });
      } else {
        await ctx.db.insert("organizationInfo", {
          key,
          content,
          type,
          lastUpdatedBy: permissions.user._id,
          lastUpdatedAt: Date.now(),
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Failed to update organization info:", error);
      return { error: "Failed to update organization info" };
    }
  },
});