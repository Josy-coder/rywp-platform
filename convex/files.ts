import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getPermissions } from "./auth";

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
    
    const filesWithUrls = await Promise.all(
      files.map(async (file) => ({
        ...file,
        fileId: await ctx.storage.getUrl(file.fileId),
      }))
    );
    
    return { data: filesWithUrls };
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    try {
      const uploadUrl = await ctx.storage.generateUploadUrl();
      return uploadUrl;
    } catch (error) {
      console.error("Error generating upload URL:", error);
      return null;
    }
  },
});

export const saveFileRecord = mutation({
  args: {
    name: v.string(),
    size: v.number(),
    type: v.string(),
    storageId: v.id("_storage"),
    description: v.optional(v.string()),
    category: v.optional(v.string()), // "hub_image", "terms_of_reference", "general", etc.
  },
  handler: async (ctx, args) => {
    try {



      return {
        success: true,
        fileId: args.storageId,
        message: "File saved successfully"
      };
    } catch (error) {
      console.error("Error saving file record:", error);
      return { error: "Failed to save file record" };
    }
  },
});

export const deleteFile = mutation({
  args: {
    fileId: v.id("_storage"),
    token: v.optional(v.string()),
  },
  handler: async (ctx, { fileId, token }) => {
    try {

      if (token) {
        const permissions = await getPermissions(ctx, token);
        if (!permissions?.isGlobalAdmin()) {
          return { error: "Insufficient permissions" };
        }
      }

      await ctx.storage.delete(fileId);



      return { success: true, message: "File deleted successfully" };
    } catch (error) {
      console.error("Error deleting file:", error);
      return { error: "Failed to delete file" };
    }
  },
});

export const getFileUrl = query({
  args: {
    fileId: v.id("_storage"),
  },
  handler: async (ctx, { fileId }) => {
    try {
      const url = await ctx.storage.getUrl(fileId);
      return { url };
    } catch (error) {
      console.error("Error getting file URL:", error);
      return { error: "Failed to get file URL" };
    }
  },
});

export const uploadHubImage = mutation({
  args: {
    hubId: v.id("hubs"),
    imageId: v.id("_storage"),
    token: v.string(),
  },
  handler: async (ctx, { hubId, imageId, token }) => {
    try {
      const permissions = await getPermissions(ctx, token);
      if (!permissions?.isGlobalAdmin() && !permissions?.canManageHub(hubId)) {
        return { error: "Insufficient permissions" };
      }

      const hub = await ctx.db.get(hubId);
      if (!hub) {
        return { error: "Hub not found" };
      }

      if (hub.image) {
        await ctx.storage.delete(hub.image);
      }

      await ctx.db.patch(hubId, {
        image: imageId,
      });

      return { success: true, message: "Hub image updated successfully" };
    } catch (error) {
      console.error("Error updating hub image:", error);
      return { error: "Failed to update hub image" };
    }
  },
});

export const uploadHubTermsOfReference = mutation({
  args: {
    hubId: v.id("hubs"),
    fileId: v.id("_storage"),
    token: v.string(),
  },
  handler: async (ctx, { hubId, fileId, token }) => {
    try {
      const permissions = await getPermissions(ctx, token);
      if (!permissions?.isGlobalAdmin() && !permissions?.canManageHub(hubId)) {
        return { error: "Insufficient permissions" };
      }

      const hub = await ctx.db.get(hubId);
      if (!hub) {
        return { error: "Hub not found" };
      }

      if (hub.termsOfReference) {
        await ctx.storage.delete(hub.termsOfReference);
      }

      await ctx.db.patch(hubId, {
        termsOfReference: fileId,
      });

      return { success: true, message: "Terms of reference updated successfully" };
    } catch (error) {
      console.error("Error updating terms of reference:", error);
      return { error: "Failed to update terms of reference" };
    }
  },
});

export const removeHubImage = mutation({
  args: {
    hubId: v.id("hubs"),
    token: v.string(),
  },
  handler: async (ctx, { hubId, token }) => {
    try {
      const permissions = await getPermissions(ctx, token);
      if (!permissions?.isGlobalAdmin() && !permissions?.canManageHub(hubId)) {
        return { error: "Insufficient permissions" };
      }

      const hub = await ctx.db.get(hubId);
      if (!hub || !hub.image) {
        return { error: "Hub or image not found" };
      }

      await ctx.storage.delete(hub.image);

      await ctx.db.patch(hubId, {
        image: undefined,
      });

      return { success: true, message: "Hub image removed successfully" };
    } catch (error) {
      console.error("Error removing hub image:", error);
      return { error: "Failed to remove hub image" };
    }
  },
});

export const removeHubTermsOfReference = mutation({
  args: {
    hubId: v.id("hubs"),
    token: v.string(),
  },
  handler: async (ctx, { hubId, token }) => {
    try {
      const permissions = await getPermissions(ctx, token);
      if (!permissions?.isGlobalAdmin() && !permissions?.canManageHub(hubId)) {
        return { error: "Insufficient permissions" };
      }

      const hub = await ctx.db.get(hubId);
      if (!hub || !hub.termsOfReference) {
        return { error: "Hub or terms of reference not found" };
      }

      await ctx.storage.delete(hub.termsOfReference);

      await ctx.db.patch(hubId, {
        termsOfReference: undefined,
      });

      return { success: true, message: "Terms of reference removed successfully" };
    } catch (error) {
      console.error("Error removing terms of reference:", error);
      return { error: "Failed to remove terms of reference" };
    }
  },
});