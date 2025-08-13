import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getPermissions, hashPassword } from "./auth";
import { internal } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";

export const getMembershipFormConfig = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("membershipFormConfig").first();
    return config || null;
  },
});

export const updateMembershipFormConfig = mutation({
  args: {
    formFields: v.array(v.any()),
    token: v.string(),
  },
  handler: async (ctx, { formFields, token }) => {
    const permissions = await getPermissions(ctx, token);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    try {
      const existing = await ctx.db.query("membershipFormConfig").first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          formFields,
          lastUpdatedBy: permissions.user._id,
          lastUpdatedAt: Date.now(),
        });
      } else {
        await ctx.db.insert("membershipFormConfig", {
          formFields,
          lastUpdatedBy: permissions.user._id,
          lastUpdatedAt: Date.now(),
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating membership form config:", error);
      return { error: "Failed to update membership form" };
    }
  },
});

export const submitMembershipApplication = mutation({
  args: {
    applicantName: v.string(),
    applicantEmail: v.string(),
    applicationData: v.object({}),
  },
  handler: async (ctx, args) => {
    try {

      const formConfig = await ctx.db.query("membershipFormConfig").first();
      if (!formConfig) {
        return { error: "Membership form not configured" };
      }

      const existing = await ctx.db
        .query("membershipApplications")
        .withIndex("by_email", (q) => q.eq("applicantEmail", args.applicantEmail))
        .first();

      if (existing) {
        return { error: "Application already submitted for this email" };
      }

      const applicationId = await ctx.db.insert("membershipApplications", {
        ...args,
        formSnapshot: formConfig.formFields,
        status: "pending",
        submittedAt: Date.now(),
      });

      await ctx.scheduler.runAfter(0, internal.emails.sendMembershipApplicationNotification, {
        applicantName: args.applicantName,
        applicantEmail: args.applicantEmail,
        applicationData: JSON.stringify(args.applicationData, null, 2),
      });

      return { success: true, applicationId };
    } catch (error) {
      console.error("Failed to submit application:", error);
      return { error: "Failed to submit application" };
    }
  },
});

export const getMembershipApplications = query({
  args: {
    paginationOpts: paginationOptsValidator,
    status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
    search: v.optional(v.string()),
    token: v.string(),
  },
  handler: async (ctx, { paginationOpts, status, search, token }) => {
    const permissions = await getPermissions(ctx, token);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    let applications = await ctx.db.query("membershipApplications")
      .withIndex("by_status", (q) => q.eq("status", status as "pending" | "approved" | "rejected"))
      .order("desc")
      .collect();


    if (search && search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      applications = applications.filter(app =>
        app.applicantName.toLowerCase().includes(searchTerm) ||
        app.applicantEmail.toLowerCase().includes(searchTerm)
      );
    }

    const startIndex = (paginationOpts.cursor ? parseInt(paginationOpts.cursor) : 0);
    const endIndex = startIndex + paginationOpts.numItems;
    const pageApplications = applications.slice(startIndex, endIndex);

    const enrichedApplications = await Promise.all(
      pageApplications.map(async (app) => {
        const reviewer = app.reviewedBy ? await ctx.db.get(app.reviewedBy) : null;
        return { ...app, reviewer };
      })
    );

    const hasMore = endIndex < applications.length;
    const nextCursor = hasMore ? endIndex.toString() : null;

    return {
      data: {
        page: enrichedApplications,
        isDone: !hasMore,
        continueCursor: nextCursor,
        totalCount: applications.length,
        filteredCount: applications.length
      }
    };
  },
});


export const reviewMembershipApplication = mutation({
  args: {
    applicationId: v.id("membershipApplications"),
    status: v.union(v.literal("approved"), v.literal("rejected")),
    notes: v.optional(v.string()),
    token: v.string(), // Add token for auth
  },
  handler: async (ctx, { applicationId, status, notes, token }) => {
    try {
      const permissions = await getPermissions(ctx, token);
      if (!permissions?.isGlobalAdmin()) {
        return { error: "Insufficient permissions" };
      }

      const application = await ctx.db.get(applicationId);
      if (!application) return { error: "Application not found" };

      await ctx.db.patch(applicationId, {
        status,
        notes,
        reviewedBy: permissions.user._id,
        reviewedAt: Date.now(),
      });

      if (status === "approved") {

        const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const { hash, salt } = await hashPassword(tempPassword);
        const hashedPassword = `${hash}:${salt}`;

        await ctx.db.insert("users", {
          name: application.applicantName,
          email: application.applicantEmail,
          phone: undefined,
          password: hashedPassword,
          emailVerified: false,
          globalRole: "member",
          isActive: true,
          joinedAt: Date.now(),
          failedLoginAttempts: 0,
        });

        await ctx.scheduler.runAfter(0, internal.emails.sendWelcomeEmail, {
          to: application.applicantEmail,
          name: application.applicantName,
          temporaryPassword: tempPassword,
        });

        return { success: true, message: "Application approved and welcome email sent with login credentials." };
      }

      return { success: true, message: "Application reviewed successfully." };
    } catch (error) {
      console.error("Failed to review application:", error);
      return { error: "Failed to review application" };
    }
  },
});

export const getMembers = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    role: v.optional(v.union(v.literal("member"), v.literal("admin"), v.literal("superadmin"))),
    hubId: v.optional(v.id("hubs")),
    token: v.string(),
  },
  handler: async (ctx, { paginationOpts, search, role, hubId, token }) => {
    const permissions = await getPermissions(ctx, token);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    let users = await ctx.db.query("users").order("desc").collect();

    if (role) {
      users = users.filter(user => user.globalRole === role);
    }

    if (search && search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      users = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }

    if (hubId) {
      const hubMemberships = await ctx.db
        .query("hubMemberships")
        .withIndex("by_hub", (q) => q.eq("hubId", hubId))
        .filter((q) => q.eq(q.field("status"), "approved"))
        .collect();

      const hubMemberIds = new Set(hubMemberships.map(m => m.userId));
      users = users.filter(user => hubMemberIds.has(user._id));
    }

    const startIndex = (paginationOpts.cursor ? parseInt(paginationOpts.cursor) : 0);
    const endIndex = startIndex + paginationOpts.numItems;
    const pageUsers = users.slice(startIndex, endIndex);

    const enrichedUsers = await Promise.all(
      pageUsers.map(async (user) => {
        const memberships = await ctx.db
          .query("hubMemberships")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .filter((q) => q.eq(q.field("status"), "approved"))
          .collect();

        const enrichedMemberships = await Promise.all(
          memberships.map(async (membership) => {
            const hub = await ctx.db.get(membership.hubId);
            return { ...membership, hub };
          })
        );

        return { ...user, hubMemberships: enrichedMemberships };
      })
    );

    const hasMore = endIndex < users.length;
    const nextCursor = hasMore ? endIndex.toString() : null;

    return {
      data: {
        page: enrichedUsers,
        isDone: !hasMore,
        continueCursor: nextCursor,
        totalCount: users.length,
        filteredCount: users.length
      }
    };
  },
});