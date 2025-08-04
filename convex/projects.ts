import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getPermissions } from "./auth";

export const getProjects = query({
  args: {
    hubId: v.optional(v.id("hubs")),
    theme: v.optional(v.string()),
    status: v.optional(v.union(v.literal("ongoing"), v.literal("completed"))),
    featuredOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, { hubId, theme, status, featuredOnly }) => {
    let projects;

    if (hubId) {

      projects = await ctx.db
        .query("projects")
        .withIndex("by_hub", (q) => q.eq("hubId", hubId))
        .collect();
    } else if (status) {

      projects = await ctx.db
        .query("projects")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect();
    } else if (theme) {

      projects = await ctx.db
        .query("projects")
        .withIndex("by_theme", (q) => q.eq("theme", theme))
        .collect();
    } else if (featuredOnly) {

      projects = await ctx.db
        .query("projects")
        .withIndex("by_featured", (q) => q.eq("isFeatured", true))
        .collect();
    } else {

      projects = await ctx.db
        .query("projects")
        .collect();
    }

    if (hubId && status) {
      projects = projects.filter(p => p.status === status);
    }
    if (hubId && theme) {
      projects = projects.filter(p => p.theme === theme);
    }
    if (hubId && featuredOnly) {
      projects = projects.filter(p => p.isFeatured === true);
    }
    if (status && theme && !hubId) {
      projects = projects.filter(p => p.theme === theme);
    }
    if (status && featuredOnly && !hubId) {
      projects = projects.filter(p => p.isFeatured === true);
    }
    if (theme && featuredOnly && !hubId && !status) {
      projects = projects.filter(p => p.isFeatured === true);
    }

    projects = projects.filter(p => p.isActive === true);

    const enrichedProjects = await Promise.all(
      projects.map(async (project) => {
        const hub = await ctx.db.get(project.hubId);
        const partners = await Promise.all(
          project.partnerIds.map(id => ctx.db.get(id))
        );

        return {
          ...project,
          hub,
          partners: partners.filter(Boolean),
        };
      })
    );

    return { data: enrichedProjects };
  },
});

export const getProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId);
    if (!project) return { error: "Project not found" };

    const hub = await ctx.db.get(project.hubId);
    const partners = await Promise.all(
      project.partnerIds.map(id => ctx.db.get(id))
    );
    const creator = await ctx.db.get(project.createdBy);

    return {
      data: {
        ...project,
        hub,
        partners: partners.filter(Boolean),
        creator,
      }
    };
  },
});

export const createProject = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    location: v.string(),
    coordinates: v.optional(v.object({
      lat: v.number(),
      lng: v.number(),
    })),
    status: v.union(v.literal("ongoing"), v.literal("completed")),
    theme: v.string(),
    hubId: v.id("hubs"),
    partnerIds: v.array(v.id("partners")),
    featuredImage: v.optional(v.id("_storage")),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    isFeatured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const permissions = await getPermissions(ctx);
    if (!permissions?.canManageHub(args.hubId)) {
      return { error: "Insufficient permissions" };
    }

    try {
      const projectId = await ctx.db.insert("projects", {
        ...args,
        isFeatured: args.isFeatured || false,
        isActive: true,
        createdAt: Date.now(),
        createdBy: permissions.user._id,
      });

      return { success: true, projectId };
    } catch (error) {
      console.error("Error creating project:", error);
      return { error: "Failed to create project" };
    }
  },
});

export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    coordinates: v.optional(v.object({
      lat: v.number(),
      lng: v.number(),
    })),
    status: v.optional(v.union(v.literal("ongoing"), v.literal("completed"))),
    theme: v.optional(v.string()),
    partnerIds: v.optional(v.array(v.id("partners"))),
    featuredImage: v.optional(v.id("_storage")),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    isFeatured: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { projectId, ...updates }) => {
    const permissions = await getPermissions(ctx);
    if (!permissions) return { error: "Not authenticated" };

    const project = await ctx.db.get(projectId);
    if (!project) return { error: "Project not found" };

    if (!permissions.canManageHub(project.hubId)) {
      return { error: "Insufficient permissions" };
    }

    try {
      await ctx.db.patch(projectId, updates);
      return { success: true };
    } catch (error) {
      console.error("Error updating project:", error);
      return { error: "Failed to update project" };
    }
  },
});

export const deleteProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const permissions = await getPermissions(ctx);
    if (!permissions) return { error: "Not authenticated" };

    const project = await ctx.db.get(projectId);
    if (!project) return { error: "Project not found" };

    if (!permissions.canManageHub(project.hubId)) {
      return { error: "Insufficient permissions" };
    }

    try {
      await ctx.db.patch(projectId, { isActive: false });
      return { success: true };
    } catch (error) {
      console.error("Error deleting project:", error);
      return { error: "Failed to delete project" };
    }
  },
});

export const getProjectsByTheme = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_theme")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const projectsByTheme: Record<string, any[]> = {};

    for (const project of projects) {
      if (!projectsByTheme[project.theme]) {
        projectsByTheme[project.theme] = [];
      }

      const hub = await ctx.db.get(project.hubId);
      const partners = await Promise.all(
        project.partnerIds.map(id => ctx.db.get(id))
      );

      projectsByTheme[project.theme].push({
        ...project,
        hub,
        partners: partners.filter(Boolean),
      });
    }

    return { data: projectsByTheme };
  },
});

export const getFeaturedProjects = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 3 }) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_featured", (q) => q.eq("isFeatured", true))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .take(limit);

    const enrichedProjects = await Promise.all(
      projects.map(async (project) => {
        const hub = await ctx.db.get(project.hubId);
        const partners = await Promise.all(
          project.partnerIds.map(id => ctx.db.get(id))
        );

        return {
          ...project,
          hub,
          partners: partners.filter(Boolean),
        };
      })
    );

    return { data: enrichedProjects };
  },
});