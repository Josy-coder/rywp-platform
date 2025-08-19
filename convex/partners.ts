import { mutation, query } from "./_generated/server";
import { getPermissions } from "./auth";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export const getPartners = query({
  args: {
    activeOnly: v.optional(v.boolean()),
    search: v.optional(v.string()),
    paginationOpts: v.optional(paginationOptsValidator),
  },
  handler: async (ctx, { activeOnly = true, search, paginationOpts }) => {
    let query = ctx.db.query("partners");

    if (activeOnly) {
      query = query.filter((q) => q.eq(q.field("isActive"), true));
    }

    let partners = await query.collect();

    if (search && search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      partners = partners.filter(partner =>
        partner.name.toLowerCase().includes(searchTerm) ||
        (partner.description && partner.description.toLowerCase().includes(searchTerm)) ||
        (partner.website && partner.website.toLowerCase().includes(searchTerm))
      );
    }

    const partnersWithUrls = await Promise.all(
      partners.map(async (partner) => ({
        ...partner,
        logoId: partner.logo,
        logo: partner.logo ? await ctx.storage.getUrl(partner.logo) : null,
      }))
    );

    if (paginationOpts) {
      const startIndex = paginationOpts.cursor ? parseInt(paginationOpts.cursor) : 0;
      const endIndex = startIndex + paginationOpts.numItems;
      const pagePartners = partnersWithUrls.slice(startIndex, endIndex);

      const hasMore = endIndex < partnersWithUrls.length;
      const nextCursor = hasMore ? endIndex.toString() : null;

      return {
        page: pagePartners,
        isDone: !hasMore,
        continueCursor: nextCursor,
      };
    }

    return { data: partnersWithUrls };
  },
});

export const getPartner = query({
  args: { partnerId: v.id("partners") },
  handler: async (ctx, { partnerId }) => {
    const partner = await ctx.db.get(partnerId);
    if (!partner) return { error: "Partner not found" };

    return {
      data: {
        ...partner,
        logoId: partner.logo,
        logo: partner.logo ? await ctx.storage.getUrl(partner.logo) : null,
      }
    };
  },
});

export const createPartner = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    website: v.optional(v.string()),
    logo: v.optional(v.id("_storage")),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const permissions = await getPermissions(ctx, args.token);
      if (!permissions?.isGlobalAdmin()) {
        return { error: "Insufficient permissions" };
      }

      const existingPartner = await ctx.db
        .query("partners")
        .filter((q) => q.eq(q.field("name"), args.name))
        .first();

      if (existingPartner) {
        return { error: "A partner with this name already exists" };
      }

      const partnerId = await ctx.db.insert("partners", {
        name: args.name,
        website: args.website,
        logo: args.logo,
        description: args.description,
        isActive: true,
        createdAt: Date.now(),
        createdBy: permissions.user._id,
      });

      return { success: true, partnerId, message: "Partner created successfully" };
    } catch (error) {
      console.error("Error creating partner:", error);
      return { error: "Failed to create partner" };
    }
  },
});

export const updatePartner = mutation({
  args: {
    partnerId: v.id("partners"),
    token: v.string(),
    name: v.optional(v.string()),
    website: v.optional(v.string()),
    logo: v.optional(v.id("_storage")),
    description: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { partnerId, token, ...updates }) => {
    try {
      const permissions = await getPermissions(ctx, token);
      if (!permissions?.isGlobalAdmin()) {
        return { error: "Insufficient permissions" };
      }

      const partner = await ctx.db.get(partnerId);
      if (!partner) {
        return { error: "Partner not found" };
      }

      if (updates.name && updates.name !== partner.name) {
        const existingPartner = await ctx.db
          .query("partners")
          .filter((q) => q.eq(q.field("name"), updates.name))
          .first();

        if (existingPartner) {
          return { error: "A partner with this name already exists" };
        }
      }

      if (updates.logo && partner.logo && updates.logo !== partner.logo) {
        try {
          await ctx.storage.delete(partner.logo);
        } catch (error) {
          console.warn("Failed to delete old logo:", error);
        }
      }

      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      );

      await ctx.db.patch(partnerId, cleanUpdates);

      return { success: true, message: "Partner updated successfully" };
    } catch (error) {
      console.error("Error updating partner:", error);
      return { error: "Failed to update partner" };
    }
  },
});

export const deletePartner = mutation({
  args: {
    partnerId: v.id("partners"),
    token: v.string(),
  },
  handler: async (ctx, { partnerId, token }) => {
    try {
      const permissions = await getPermissions(ctx, token);
      if (!permissions?.isGlobalAdmin()) {
        return { error: "Insufficient permissions" };
      }

      const partner = await ctx.db.get(partnerId);
      if (!partner) {
        return { error: "Partner not found" };
      }

      const projectsUsingPartner = await ctx.db
        .query("projects")
        .filter((q) => q.eq(q.field("partnerIds"), [partnerId]))
        .collect();

      if (projectsUsingPartner.length > 0) {
        return {
          error: `Cannot delete partner. It is currently used in ${projectsUsingPartner.length} project(s). Please remove the partner from all projects first.`
        };
      }

      if (partner.logo) {
        try {
          await ctx.storage.delete(partner.logo);
        } catch (error) {
          console.warn("Failed to delete partner logo:", error);
        }
      }

      await ctx.db.delete(partnerId);

      return { success: true, message: "Partner deleted successfully" };
    } catch (error) {
      console.error("Error deleting partner:", error);
      return { error: "Failed to delete partner" };
    }
  },
});

export const uploadPartnerLogo = mutation({
  args: {
    partnerId: v.id("partners"),
    logoId: v.id("_storage"),
    token: v.string(),
  },
  handler: async (ctx, { partnerId, logoId, token }) => {
    try {
      const permissions = await getPermissions(ctx, token);
      if (!permissions?.isGlobalAdmin()) {
        return { error: "Insufficient permissions" };
      }

      const partner = await ctx.db.get(partnerId);
      if (!partner) {
        return { error: "Partner not found" };
      }

      if (partner.logo) {
        try {
          await ctx.storage.delete(partner.logo);
        } catch (error) {
          console.warn("Failed to delete old logo:", error);
        }
      }

      await ctx.db.patch(partnerId, {
        logo: logoId,
      });

      return { success: true, message: "Partner logo updated successfully" };
    } catch (error) {
      console.error("Error updating partner logo:", error);
      return { error: "Failed to update partner logo" };
    }
  },
});

export const removePartnerLogo = mutation({
  args: {
    partnerId: v.id("partners"),
    token: v.string(),
  },
  handler: async (ctx, { partnerId, token }) => {
    try {
      const permissions = await getPermissions(ctx, token);
      if (!permissions?.isGlobalAdmin()) {
        return { error: "Insufficient permissions" };
      }

      const partner = await ctx.db.get(partnerId);
      if (!partner || !partner.logo) {
        return { error: "Partner or logo not found" };
      }

      try {
        await ctx.storage.delete(partner.logo);
      } catch (error) {
        console.warn("Failed to delete logo from storage:", error);
      }

      await ctx.db.patch(partnerId, {
        logo: undefined,
      });

      return { success: true, message: "Partner logo removed successfully" };
    } catch (error) {
      console.error("Error removing partner logo:", error);
      return { error: "Failed to remove partner logo" };
    }
  },
});

export const togglePartnerStatus = mutation({
  args: {
    partnerId: v.id("partners"),
    token: v.string(),
  },
  handler: async (ctx, { partnerId, token }) => {
    try {
      const permissions = await getPermissions(ctx, token);
      if (!permissions?.isGlobalAdmin()) {
        return { error: "Insufficient permissions" };
      }

      const partner = await ctx.db.get(partnerId);
      if (!partner) {
        return { error: "Partner not found" };
      }

      await ctx.db.patch(partnerId, {
        isActive: !partner.isActive,
      });

      return {
        success: true,
        message: `Partner ${partner.isActive ? 'deactivated' : 'activated'} successfully`,
        newStatus: !partner.isActive
      };
    } catch (error) {
      console.error("Error toggling partner status:", error);
      return { error: "Failed to update partner status" };
    }
  },
});