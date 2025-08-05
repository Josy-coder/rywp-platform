import { getPermissions } from "./auth";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCareerOpportunities = query({
  args: {
    type: v.optional(v.union(
      v.literal("job"),
      v.literal("internship"),
      v.literal("fellowship"),
      v.literal("call_for_proposal")
    )),
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, { type, activeOnly = true }) => {
    let opportunities;

    if (type) {

      opportunities = await ctx.db
        .query("careerOpportunities")
        .withIndex("by_type", (q) => q.eq("type", type))
        .collect();
    } else {

      opportunities = await ctx.db
        .query("careerOpportunities")
        .collect();
    }

    if (activeOnly) {
      opportunities = opportunities.filter(opp => opp.isActive);
    }

    opportunities.sort((a, b) => a.applicationDeadline - b.applicationDeadline);

    const enrichedOpportunities = await Promise.all(
      opportunities.map(async (opp) => {
        const creator = await ctx.db.get(opp.createdBy);
        return { ...opp, creator };
      })
    );

    return { data: enrichedOpportunities };
  },
});

export const createCareerOpportunity = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    type: v.union(
      v.literal("job"),
      v.literal("internship"),
      v.literal("fellowship"),
      v.literal("call_for_proposal")
    ),
    requirements: v.string(),
    applicationDeadline: v.number(),
    contactEmail: v.string(),
    applicationLink: v.optional(v.string()),
    attachments: v.optional(v.array(v.id("_storage"))),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const permissions = await getPermissions(ctx, args.token);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    try {
      const opportunityId = await ctx.db.insert("careerOpportunities", {
        ...args,
        attachments: args.attachments || [],
        isActive: true,
        createdAt: Date.now(),
        createdBy: permissions.user._id,
      });

      return { success: true, opportunityId };
    } catch (error) {
      console.error("Failed to create career opportunity:", error);
      return { error: "Failed to create career opportunity" };
    }
  },
});

export const updateCareerOpportunity = mutation({
  args: {
    opportunityId: v.id("careerOpportunities"),
    token: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    requirements: v.optional(v.string()),
    applicationDeadline: v.optional(v.number()),
    contactEmail: v.optional(v.string()),
    applicationLink: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { opportunityId, token, ...updates }) => {
    const permissions = await getPermissions(ctx, token);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    try {
      await ctx.db.patch(opportunityId, updates);
      return { success: true };
    } catch (error) {
      console.error("Failed to update career opportunity:", error);
      return { error: "Failed to update career opportunity" };
    }
  },
});