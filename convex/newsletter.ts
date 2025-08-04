import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getPermissions } from "./auth";

export const subscribeToNewsletter = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    preferences: v.optional(v.object({
      events: v.boolean(),
      publications: v.boolean(),
      opportunities: v.boolean(),
    })),
  },
  handler: async (ctx, args) => {
    try {

      const existing = await ctx.db
        .query("newsletterSubscriptions")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();

      if (existing) {
        if (existing.isActive) {
          return { error: "Already subscribed" };
        } else {

          await ctx.db.patch(existing._id, {
            isActive: true,
            name: args.name || existing.name,
            preferences: args.preferences || existing.preferences,
            subscribedAt: Date.now(),
            unsubscribedAt: undefined,
          });
          return { success: true };
        }
      }

      await ctx.db.insert("newsletterSubscriptions", {
        ...args,
        isActive: true,
        subscribedAt: Date.now(),
        preferences: args.preferences || {
          events: true,
          publications: true,
          opportunities: true,
        },
      });

      return { success: true };
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      return { error: "Failed to subscribe to newsletter" };
    }
  },
});

export const unsubscribeFromNewsletter = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    try {
      const subscription = await ctx.db
        .query("newsletterSubscriptions")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();

      if (!subscription) {
        return { error: "Subscription not found" };
      }

      await ctx.db.patch(subscription._id, {
        isActive: false,
        unsubscribedAt: Date.now(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error unsubscribing from newsletter:", error);
      return { error: "Failed to unsubscribe" };
    }
  },
});

export const getNewsletterSubscribers = query({
  args: { activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, { activeOnly = true }) => {
    const permissions = await getPermissions(ctx);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    let subscribers;
    if (activeOnly) {
      subscribers = await ctx.db
        .query("newsletterSubscriptions")
        .withIndex("by_active", (q) => q.eq("isActive", true))
        .collect();
    } else {
      subscribers = await ctx.db
        .query("newsletterSubscriptions")
        .collect();
    }

    return { data: subscribers };
  },
});