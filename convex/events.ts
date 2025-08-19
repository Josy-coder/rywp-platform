import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getPermissions } from "./auth";

export const getEvents = query({
  args: {
    upcoming: v.optional(v.boolean()),
    type: v.optional(v.union(v.literal("event"), v.literal("knowledge_session"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { upcoming, type, limit }) => {
    let events;

    if (upcoming) {
      events = await ctx.db
        .query("events")
        .withIndex("by_start_date", (q) => q.gte("startDate", Date.now()))
        .collect();
    } else {
      events = await ctx.db
        .query("events")
        .withIndex("by_start_date")
        .order("desc")
        .collect();
    }

    if (type) {
      events = events.filter(event => event.type === type);
    }

    events = events.filter(event => event.isActive === true);

    const limitedResults = limit ? events.slice(0, limit) : events;

    const enrichedEvents = await Promise.all(
      limitedResults.map(async (event) => {
        const organizer = await ctx.db.get(event.createdBy);
        const hub = event.hubId ? await ctx.db.get(event.hubId) : null;

        return {
          ...event,
          featuredImageId: event.featuredImage,
          featuredImage: event.featuredImage ? await ctx.storage.getUrl(event.featuredImage) : null,
          organizer: organizer ? {
            ...organizer,
            profileImageId: organizer.profileImage,
            profileImage: organizer.profileImage ? await ctx.storage.getUrl(organizer.profileImage) : null,
          } : null,
          hub: hub ? {
            ...hub,
            imageId: hub.image,
            image: hub.image ? await ctx.storage.getUrl(hub.image) : null,
            termsOfReferenceId: hub.termsOfReference,
            termsOfReference: hub.termsOfReference ? await ctx.storage.getUrl(hub.termsOfReference) : null,
          } : null,
        };
      })
    );

    return { data: enrichedEvents };
  },
});

export const createEvent = mutation({
  args: {
    title: v.string(),
    token: v.string(),
    description: v.string(),
    type: v.union(v.literal("event"), v.literal("knowledge_session")),
    startDate: v.number(),
    endDate: v.number(),
    location: v.optional(v.string()),
    isOnline: v.boolean(),
    meetingLink: v.optional(v.string()),
    maxAttendees: v.optional(v.number()),
    registrationRequired: v.boolean(),
    registrationDeadline: v.optional(v.number()),
    featuredImage: v.optional(v.id("_storage")),
    hubId: v.optional(v.id("hubs")),
  },
  handler: async (ctx, args) => {
    const permissions = await getPermissions(ctx, args.token);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    try {
      const eventId = await ctx.db.insert("events", {
        ...args,
        isActive: true,
        createdAt: Date.now(),
        createdBy: permissions.user._id,
      });

      return { success: true, eventId };
    } catch (error) {
      console.error("Error creating event:", error);
      return { error: "Failed to create event" };
    }
  },
});

export const getEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    const event = await ctx.db.get(eventId);
    if (!event || !event.isActive) {
      return { error: "Event not found" };
    }

    const organizer = await ctx.db.get(event.createdBy);
    const hub = event.hubId ? await ctx.db.get(event.hubId) : null;

    const enrichedEvent = {
      ...event,
      featuredImage: event.featuredImage ? {
        id: event.featuredImage,
        url: await ctx.storage.getUrl(event.featuredImage)
      } : null,
      organizer: organizer ? {
        ...organizer,
        profileImage: organizer.profileImage ? {
          id: organizer.profileImage,
          url: await ctx.storage.getUrl(organizer.profileImage)
        } : null,
      } : null,
      hub: hub ? {
        ...hub,
        image: hub.image ? {
          id: hub.image,
          url: await ctx.storage.getUrl(hub.image)
        } : null,
        termsOfReference: hub.termsOfReference ? {
          id: hub.termsOfReference,
          url: await ctx.storage.getUrl(hub.termsOfReference)
        } : null,
      } : null,
    };

    return { data: enrichedEvent };
  },
});

export const updateEvent = mutation({
  args: {
    eventId: v.id("events"),
    token: v.string(),
    title: v.string(),
    description: v.string(),
    type: v.union(v.literal("event"), v.literal("knowledge_session")),
    startDate: v.number(),
    endDate: v.number(),
    location: v.optional(v.string()),
    isOnline: v.boolean(),
    meetingLink: v.optional(v.string()),
    maxAttendees: v.optional(v.number()),
    registrationRequired: v.boolean(),
    registrationDeadline: v.optional(v.number()),
    featuredImage: v.optional(v.id("_storage")),
    hubId: v.optional(v.id("hubs")),
  },
  handler: async (ctx, args) => {
    const permissions = await getPermissions(ctx, args.token);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    const event = await ctx.db.get(args.eventId);
    if (!event) {
      return { error: "Event not found" };
    }

    try {
      await ctx.db.patch(args.eventId, {
        title: args.title,
        description: args.description,
        type: args.type,
        startDate: args.startDate,
        endDate: args.endDate,
        location: args.location,
        isOnline: args.isOnline,
        meetingLink: args.meetingLink,
        maxAttendees: args.maxAttendees,
        registrationRequired: args.registrationRequired,
        registrationDeadline: args.registrationDeadline,
        featuredImage: args.featuredImage,
        hubId: args.hubId,
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating event:", error);
      return { error: "Failed to update event" };
    }
  },
});

export const deleteEvent = mutation({
  args: {
    eventId: v.id("events"),
    token: v.string(),
  },
  handler: async (ctx, { eventId, token }) => {
    const permissions = await getPermissions(ctx, token);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    const event = await ctx.db.get(eventId);
    if (!event) {
      return { error: "Event not found" };
    }

    try {
      await ctx.db.patch(eventId, {
        isActive: false,
      });

      return { success: true };
    } catch (error) {
      console.error("Error deleting event:", error);
      return { error: "Failed to delete event" };
    }
  },
});