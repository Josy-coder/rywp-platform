import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getPermissions, hashPassword } from "./auth";
import { internal } from "./_generated/api";

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
    status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
    token: v.string(),
  },
  handler: async (ctx, { status, token}) => {
    const permissions = await getPermissions(ctx, token);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    let applications;
    if (status) {
      applications = await ctx.db
        .query("membershipApplications")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect();
    } else {
      applications = await ctx.db
        .query("membershipApplications")
        .collect();
    }

    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const reviewer = app.reviewedBy ? await ctx.db.get(app.reviewedBy) : null;
        return { ...app, reviewer };
      })
    );

    return { data: enrichedApplications };
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
        // Generate temporary password
        const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const { hash, salt } = await hashPassword(tempPassword);
        const hashedPassword = `${hash}:${salt}`;

        // Create user account
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