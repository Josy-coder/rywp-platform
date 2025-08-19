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
        
        const attachmentUrls = await Promise.all(
          opp.attachments.map(async (attachmentId) => 
            await ctx.storage.getUrl(attachmentId)
          )
        );
        
        return { 
          ...opp, 
          attachmentIds: opp.attachments,
          attachments: attachmentUrls,
          creator: creator ? {
            ...creator,
            profileImageId: creator.profileImage,
            profileImage: creator.profileImage ? await ctx.storage.getUrl(creator.profileImage) : null,
          } : null,
        };
      })
    );

    return { data: enrichedOpportunities };
  },
});

export const getCareerOpportunity = query({
  args: { opportunityId: v.id("careerOpportunities") },
  handler: async (ctx, { opportunityId }) => {
    const opportunity = await ctx.db.get(opportunityId);
    if (!opportunity || !opportunity.isActive) {
      return { error: "Career opportunity not found" };
    }

    const creator = await ctx.db.get(opportunity.createdBy);
    
    const attachmentUrls = await Promise.all(
      opportunity.attachments.map(async (attachmentId) => 
        await ctx.storage.getUrl(attachmentId)
      )
    );

    const enrichedOpportunity = {
      ...opportunity,
      attachmentIds: opportunity.attachments,
      attachments: attachmentUrls,
      creator: creator ? {
        ...creator,
        profileImageId: creator.profileImage,
        profileImage: creator.profileImage ? await ctx.storage.getUrl(creator.profileImage) : null,
      } : null,
    };

    return { data: enrichedOpportunity };
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
    attachments: v.optional(v.array(v.id("_storage"))),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { opportunityId, token, ...updates }) => {
    const permissions = await getPermissions(ctx, token);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    try {
      // Handle attachment cleanup if new attachments are provided
      const currentOpportunity = await ctx.db.get(opportunityId);
      if (updates.attachments && currentOpportunity && currentOpportunity.attachments) {
        const oldAttachments = currentOpportunity.attachments;
        const newAttachments = updates.attachments;
        const attachmentsToDelete = oldAttachments.filter(id => !newAttachments.includes(id));

        for (const attachmentId of attachmentsToDelete) {
          try {
            await ctx.storage.delete(attachmentId);
          } catch (error) {
            console.warn("Failed to delete old attachment:", error);
          }
        }
      }

      await ctx.db.patch(opportunityId, updates);
      return { success: true };
    } catch (error) {
      console.error("Failed to update career opportunity:", error);
      return { error: "Failed to update career opportunity" };
    }
  },
});

export const deleteCareerOpportunity = mutation({
  args: {
    opportunityId: v.id("careerOpportunities"),
    token: v.string(),
  },
  handler: async (ctx, { opportunityId, token }) => {
    const permissions = await getPermissions(ctx, token);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    const opportunity = await ctx.db.get(opportunityId);
    if (!opportunity) {
      return { error: "Career opportunity not found" };
    }

    try {
      await ctx.db.patch(opportunityId, {
        isActive: false,
      });

      return { success: true };
    } catch (error) {
      console.error("Error deleting career opportunity:", error);
      return { error: "Failed to delete career opportunity" };
    }
  },
});

export const permanentlyDeleteCareerOpportunity = mutation({
  args: {
    opportunityId: v.id("careerOpportunities"),
    token: v.string(),
  },
  handler: async (ctx, { opportunityId, token }) => {
    const permissions = await getPermissions(ctx, token);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    const opportunity = await ctx.db.get(opportunityId);
    if (!opportunity) {
      return { error: "Career opportunity not found" };
    }

    try {
      // Delete attachments from storage
      if (opportunity.attachments && opportunity.attachments.length > 0) {
        for (const attachmentId of opportunity.attachments) {
          try {
            await ctx.storage.delete(attachmentId);
          } catch (error) {
            console.warn("Failed to delete attachment:", error);
          }
        }
      }

      await ctx.db.delete(opportunityId);

      return { success: true };
    } catch (error) {
      console.error("Error permanently deleting career opportunity:", error);
      return { error: "Failed to permanently delete career opportunity" };
    }
  },
});