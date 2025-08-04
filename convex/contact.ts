import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getPermissions } from "./auth";

export const getContactFormConfig = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("contactFormConfig").first();
    return config || null;
  },
});

export const updateContactFormConfig = mutation({
  args: {
    formFields: v.array(v.any()),
  },
  handler: async (ctx, { formFields }) => {
    const permissions = await getPermissions(ctx);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    try {
      const existing = await ctx.db.query("contactFormConfig").first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          formFields,
          lastUpdatedBy: permissions.user._id,
          lastUpdatedAt: Date.now(),
        });
      } else {
        await ctx.db.insert("contactFormConfig", {
          formFields,
          lastUpdatedBy: permissions.user._id,
          lastUpdatedAt: Date.now(),
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating contact form config:", error);
      return { error: "Failed to update contact form" };
    }
  },
});

export const submitContactForm = mutation({
  args: {
    senderName: v.string(),
    senderEmail: v.string(),
    formData: v.object({}),
  },
  handler: async (ctx, args) => {
    try {

      const formConfig = await ctx.db.query("contactFormConfig").first();
      if (!formConfig) {
        return { error: "Contact form not configured" };
      }

      const submissionId = await ctx.db.insert("contactSubmissions", {
        ...args,
        formSnapshot: formConfig.formFields,
        status: "unread",
        submittedAt: Date.now(),
      });


      return { success: true, submissionId };
    } catch (error) {
      console.error("Error submitting contact form:", error);
      return { error: "Failed to submit contact form" };
    }
  },
});

export const getContactSubmissions = query({
  args: {
    status: v.optional(v.union(v.literal("unread"), v.literal("read"), v.literal("replied"))),
  },
  handler: async (ctx, { status }) => {
    const permissions = await getPermissions(ctx);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    let submissions;
    if (status) {
      submissions = await ctx.db
        .query("contactSubmissions")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect();
    } else {
      submissions = await ctx.db
        .query("contactSubmissions")
        .collect();
    }

    const enrichedSubmissions = await Promise.all(
      submissions.map(async (sub) => {
        const handler = sub.handledBy ? await ctx.db.get(sub.handledBy) : null;
        return { ...sub, handler };
      })
    );

    return { data: enrichedSubmissions };
  },
});

export const updateContactSubmissionStatus = mutation({
  args: {
    submissionId: v.id("contactSubmissions"),
    status: v.union(v.literal("read"), v.literal("replied")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { submissionId, status, notes }) => {
    const permissions = await getPermissions(ctx);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    try {
      await ctx.db.patch(submissionId, {
        status,
        notes,
        handledBy: permissions.user._id,
        handledAt: Date.now(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating submission status:", error);
      return { error: "Failed to update submission status" };
    }
  },
});