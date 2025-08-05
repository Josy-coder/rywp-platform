import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getPermissions } from "./auth";

export const getMediaItems = query({
  args: {
    type: v.optional(v.union(v.literal("image"), v.literal("video"))),
    eventId: v.optional(v.id("events")),
    projectId: v.optional(v.id("projects")),
    tags: v.optional(v.array(v.string())),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { type, eventId, projectId, tags, limit }) => {
    let mediaItems;

    if (type) {
      mediaItems = await ctx.db
        .query("mediaItems")
        .withIndex("by_type", (q) => q.eq("type", type))
        .collect();
    } else if (eventId) {
      mediaItems = await ctx.db
        .query("mediaItems")
        .withIndex("by_event", (q) => q.eq("eventId", eventId))
        .collect();
    } else if (projectId) {
      mediaItems = await ctx.db
        .query("mediaItems")
        .withIndex("by_project", (q) => q.eq("projectId", projectId))
        .collect();
    } else {
      mediaItems = await ctx.db
        .query("mediaItems")
        .collect();
    }

    if (type && eventId) {
      mediaItems = mediaItems.filter(item => item.eventId === eventId);
    }
    if (type && projectId) {
      mediaItems = mediaItems.filter(item => item.projectId === projectId);
    }
    if (!type && !eventId && projectId) {
      mediaItems = mediaItems.filter(item => item.projectId === projectId);
    }
    if (!type && !projectId && eventId) {
      mediaItems = mediaItems.filter(item => item.eventId === eventId);
    }

    mediaItems = mediaItems.filter(item => item.isActive === true);

    if (tags && tags.length > 0) {
      mediaItems = mediaItems.filter(item =>
        tags.some(tag => item.tags.includes(tag))
      );
    }

    mediaItems.sort((a, b) => b.uploadedAt - a.uploadedAt);

    const limitedResults = limit ? mediaItems.slice(0, limit) : mediaItems;

    const enrichedMedia = await Promise.all(
      limitedResults.map(async (item) => {
        const uploader = await ctx.db.get(item.uploadedBy);
        const event = item.eventId ? await ctx.db.get(item.eventId) : null;
        const project = item.projectId ? await ctx.db.get(item.projectId) : null;

        return {
          ...item,
          uploader,
          event,
          project,
        };
      })
    );

    return { data: enrichedMedia };
  },
});

export const uploadMediaItem = mutation({
  args: {
    token: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("image"), v.literal("video")),
    fileId: v.id("_storage"),
    tags: v.optional(v.array(v.string())),
    eventId: v.optional(v.id("events")),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, args) => {
    const permissions = await getPermissions(ctx, args.token);
    if (!permissions) return { error: "Not authenticated" };

    try {
      const mediaId = await ctx.db.insert("mediaItems", {
        ...args,
        tags: args.tags || [],
        uploadedBy: permissions.user._id,
        uploadedAt: Date.now(),
        isActive: true,
      });

      return { success: true, mediaId };
    } catch (error) {
      console.error("Failed to upload media item:", error);
      return { error: "Failed to upload media item" };
    }
  },
});

export const deleteMediaItem = mutation({
  args: {
    mediaId: v.id("mediaItems"),
    token: v.string()
  },
  handler: async (ctx, { mediaId, token }) => {
    const permissions = await getPermissions(ctx, token);
    if (!permissions) return { error: "Not authenticated" };

    const mediaItem = await ctx.db.get(mediaId);
    if (!mediaItem) return { error: "Media item not found" };

    const canDelete = mediaItem.uploadedBy === permissions.user._id ||
      permissions.isGlobalAdmin();

    if (!canDelete) {
      return { error: "Insufficient permissions" };
    }

    try {
      await ctx.db.patch(mediaId, { isActive: false });
      return { success: true };
    } catch (error) {
      console.error("Failed to delete media item:", error);
      return { error: "Failed to delete media item" };
    }
  },
});
