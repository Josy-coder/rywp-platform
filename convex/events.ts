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
          organizer,
          hub,
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
      return { error: "Failed to create event" };
    }
  },
});