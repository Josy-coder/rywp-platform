import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const handleFormFileUpload = mutation({
  args: {
    submissionId: v.string(),
    submissionType: v.union(v.literal("membership"), v.literal("hub_membership"), v.literal("contact")),
    fieldName: v.string(),
    fileName: v.string(),
    fileId: v.id("_storage"),
    fileType: v.string(),
    fileSize: v.number(),
  },
  handler: async (ctx, args) => {
    try {
      const fileRecordId = await ctx.db.insert("formFiles", {
        ...args,
        uploadedAt: Date.now(),
      });

      return { success: true, fileRecordId };
    } catch (error) {
      console.error("Error recording file upload:", error);
      return { error: "Failed to record file upload" };
    }
  },
});

export const getFormFiles = query({
  args: {
    submissionId: v.string(),
    submissionType: v.union(v.literal("membership"), v.literal("hub_membership"), v.literal("contact")),
    fieldName: v.optional(v.string()),
  },
  handler: async (ctx, { submissionId, submissionType, fieldName }) => {
    let query = ctx.db
      .query("formFiles")
      .withIndex("by_submission", (q) => q.eq("submissionId", submissionId).eq("submissionType", submissionType));

    if (fieldName) {
      query = query.filter((q) => q.eq(q.field("fieldName"), fieldName));
    }

    const files = await query.collect();
    return { data: files };
  },
});