import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = internalAction({
  args: {
    to: v.string(),
    name: v.string(),
    temporaryPassword: v.optional(v.string()),
  },
  handler: async (_ctx, { to, name, temporaryPassword }) => {
    try {
      const { data, error } = await resend.emails.send({
        from: "RYWP <noreply@rywp.org>",
        to: [to],
        subject: "Welcome to Rwanda Young Water Professionals (RYWP)!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Welcome to RYWP!</h1>
            
            <p>Dear ${name},</p>
            
            <p>Congratulations! Your membership application to Rwanda Young Water Professionals (RYWP) has been approved.</p>
            
            <p>You can now access our member portal and:</p>
            <ul>
              <li>Apply to join specific hubs</li>
              <li>Access member-only publications</li>
              <li>Register for exclusive events</li>
              <li>Connect with fellow water professionals</li>
            </ul>
            
            ${
              temporaryPassword
                ? `
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3>Login Information:</h3>
                <p><strong>Email:</strong> ${to}</p>
                <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
                <p style="color: #dc2626; font-size: 14px;">Please change your password after logging in for the first time.</p>
              </div>
            `
                : `
              <p>You can log in using the same credentials you used when applying.</p>
            `
            }
            
            <p style="margin-top: 30px;">
              <a href="${process.env.SITE_URL}/login" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Login to Your Account</a>
            </p>
            
            <p>If you have any questions, feel free to reach out to us.</p>
            
            <p>Welcome aboard!</p>
            <p>The RYWP Team</p>
            
            <hr style="margin-top: 40px; border: none; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #6b7280;">
              Rwanda Young Water Professionals<br>
              Email: info@rywp.org<br>
              Website: <a href="${process.env.SITE_URL}">${process.env.SITE_URL}</a>
            </p>
          </div>
        `,
      });

      if (error) {
        return { error: "Failed to send welcome email" };
      }

      return { success: true, emailId: data?.id };
    } catch (error) {
      console.error("Error sending welcome email:", error);
      return { error: "Failed to send welcome email" };
    }
  },
});

export const sendTechnicalReportAccessEmail = internalAction({
  args: {
    to: v.string(),
    name: v.string(),
    publicationTitle: v.string(),
    status: v.union(v.literal("approved"), v.literal("denied")),
    accessLink: v.optional(v.string()),
    reason: v.optional(v.string()),
  },
  handler: async (_ctx, { to, name, publicationTitle, status, accessLink, reason }) => {
    try {
      const subject = status === "approved"
        ? `Access Granted: ${publicationTitle}`
        : `Access Request Update: ${publicationTitle}`;

      const html = status === "approved" ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #059669;">Access Granted!</h1>
          
          <p>Dear ${name},</p>
          
          <p>Your request for access to the technical report "<strong>${publicationTitle}</strong>" has been approved.</p>
          
          ${accessLink ? `
            <p>You can access the report using the link below:</p>
            <p style="margin: 20px 0;">
              <a href="${accessLink}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Access Report</a>
            </p>
            <p style="font-size: 14px; color: #6b7280;">This link will expire in 30 days for security purposes.</p>
          ` : `
            <p>The report will be sent to you separately via email.</p>
          `}
          
          <p>Please ensure that you use this material in accordance with our terms of use and properly cite RYWP in any publications or presentations that reference this work.</p>
          
          <p>Thank you for your interest in our research.</p>
          <p>Best regards,<br>The RYWP Research Team</p>
        </div>
      ` : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Access Request Update</h1>
          
          <p>Dear ${name},</p>
          
          <p>Thank you for your interest in the technical report "<strong>${publicationTitle}</strong>".</p>
          
          <p>After careful review, we are unable to grant access to this report at this time.</p>
          
          ${reason ? `
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Reason:</strong> ${reason}</p>
            </div>
          ` : ''}
          
          <p>If you have any questions about this decision or would like to discuss alternative ways to access relevant research, please don't hesitate to contact us.</p>
          
          <p>Thank you for your understanding.</p>
          <p>Best regards,<br>The RYWP Research Team</p>
        </div>
      `;

      const { data, error } = await resend.emails.send({
        from: "RYWP Research <research@rywp.org>",
        to: [to],
        subject,
        html,
      });

      if (error) {
        return { error: "Failed to send access notification email" };
      }

      return { success: true, emailId: data?.id };
    } catch (error) {
      console.error("Error sending access notification email:", error);
      return { error: "Failed to send access notification email" };
    }
  },
});

export const sendHubApplicationNotification = internalAction({
  args: {
    to: v.string(),
    name: v.string(),
    hubName: v.string(),
    status: v.union(v.literal("approved"), v.literal("rejected")),
    notes: v.optional(v.string()),
  },
  handler: async (_ctx, { to, name, hubName, status, notes }) => {
    try {
      const subject = status === "approved"
        ? `Welcome to ${hubName}!`
        : `Hub Application Update - ${hubName}`;

      const html = status === "approved" ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #059669;">Welcome to ${hubName}!</h1>
          
          <p>Dear ${name},</p>
          
          <p>Congratulations! Your application to join <strong>${hubName}</strong> has been approved.</p>
          
          <p>As a hub member, you now have access to:</p>
          <ul>
            <li>Hub-specific projects and initiatives</li>
            <li>Exclusive hub events and workshops</li>
            <li>Direct collaboration opportunities</li>
            <li>Hub leadership opportunities</li>
          </ul>
          
          ${notes ? `
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4>Message from Hub Leadership:</h4>
              <p>${notes}</p>
            </div>
          ` : ''}
          
          <p style="margin-top: 30px;">
            <a href="${process.env.SITE_URL}/dashboard/hubs" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Access Hub Dashboard</a>
          </p>
          
          <p>Welcome to the team!</p>
          <p>The ${hubName} Leadership Team</p>
        </div>
      ` : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Hub Application Update</h1>
          
          <p>Dear ${name},</p>
          
          <p>Thank you for your interest in joining <strong>${hubName}</strong>.</p>
          
          <p>After careful review, we are unable to approve your application at this time.</p>
          
          ${notes ? `
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4>Feedback:</h4>
              <p>${notes}</p>
            </div>
          ` : ''}
          
          <p>We encourage you to continue your engagement with RYWP through our general member activities. You may also consider reapplying to this or other hubs in the future.</p>
          
          <p>Thank you for your understanding.</p>
          <p>The ${hubName} Leadership Team</p>
        </div>
      `;

      const { data, error } = await resend.emails.send({
        from: "RYWP Hubs <hubs@rywp.org>",
        to: [to],
        subject,
        html,
      });

      if (error) {
        return { error: "Failed to send hub notification email" };
      }

      return { success: true, emailId: data?.id };
    } catch (error) {
      console.error("Error sending hub notification email:", error);
      return { error: "Failed to send hub notification email" };
    }
  },
});

export const sendMembershipApplicationNotification = internalAction({
  args: {
    applicantName: v.string(),
    applicantEmail: v.string(),
    applicationData: v.string(),
  },
  handler: async (_ctx, { applicantName, applicantEmail, applicationData }) => {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@rywp.org";

      const { data, error } = await resend.emails.send({
        from: "RYWP Membership <membership@rywp.org>",
        to: [adminEmail],
        subject: `New Membership Application - ${applicantName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">New Membership Application</h1>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3>Applicant Information:</h3>
              <p><strong>Name:</strong> ${applicantName}</p>
              <p><strong>Email:</strong> ${applicantEmail}</p>
            </div>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3>Application Details:</h3>
              <pre style="background-color: #ffffff; padding: 15px; border-radius: 3px; font-size: 12px; white-space: pre-wrap;">${applicationData}</pre>
            </div>
            
            <p style="margin-top: 30px;">
              <a href="${process.env.SITE_URL}/admin/membership" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Review Application</a>
            </p>
          </div>
        `,
      });

      if (error) {
        return { error: "Failed to send membership notification" };
      }

      return { success: true, emailId: data?.id };
    } catch (error) {
      console.error("Error sending membership application notification:", error);
      return { error: "Failed to send membership notification" };
    }
  },
});

export const sendPasswordResetEmail = internalAction({
  args: {
    to: v.string(),
    name: v.string(),
    resetToken: v.string(),
  },
  handler: async (_ctx, { to, name, resetToken }) => {
    try {
      const resetLink = `${process.env.SITE_URL}/reset-password?token=${resetToken}`;

      const { data, error } = await resend.emails.send({
        from: "RYWP <noreply@rywp.org>",
        to: [to],
        subject: "Reset Your RYWP Password",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Password Reset Request</h1>
            
            <p>Dear ${name},</p>
            
            <p>You have requested to reset your password for your RYWP account. Click the button below to create a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            </div>
            
            <p>This link will expire in 30 minutes for security purposes.</p>
            
            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${resetLink}</p>
            
            <p>Best regards,<br>The RYWP Team</p>
            
            <hr style="margin-top: 40px; border: none; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #6b7280;">
              Rwanda Young Water Professionals<br>
              Email: info@rywp.org<br>
              Website: <a href="${process.env.SITE_URL}">${process.env.SITE_URL}</a>
            </p>
            </div>
        `,
      });

      if (error) {
        return { error: "Failed to send password reset email" };
      }

      return { success: true, emailId: data?.id };
    } catch (error) {
      console.error("Error sending password reset email:", error);
      return { error: "Failed to send password reset email" };
    }
  },
});

export const sendAdminWelcomeEmail = internalAction({
  args: {
    to: v.string(),
    name: v.string(),
    temporaryPassword: v.string(),
    role: v.union(v.literal("admin"), v.literal("superadmin")),
  },
  handler: async (_ctx, { to, name, temporaryPassword, role }) => {
    try {
      const { data, error } = await resend.emails.send({
        from: "RYWP <noreply@rywp.org>",
        to: [to],
        subject: `Welcome to RYWP - ${role === "superadmin" ? "Super Admin" : "Admin"} Access Granted`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Welcome to RYWP - Admin Team!</h1>
            
            <p>Dear ${name},</p>
            
            <p>You have been granted <strong>${role === "superadmin" ? "Super Administrator" : "Administrator"}</strong> access to the Rwanda Young Water Professionals (RYWP) platform.</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3>Login Information:</h3>
              <p><strong>Email:</strong> ${to}</p>
              <p><strong>Temporary Password:</strong> <code style="background-color: #e5e7eb; padding: 2px 4px; border-radius: 3px;">${temporaryPassword}</code></p>
              <p style="color: #dc2626; font-size: 14px;"><strong>Important:</strong> Please change your password immediately after logging in.</p>
            </div>
            
            <p>As an ${role === "superadmin" ? "Super Administrator" : "Administrator"}, you have access to:</p>
            <ul>
              <li>Content management system (CMS)</li>
              <li>User and membership management</li>
              <li>Hub and project oversight</li>
              <li>Publication approval and management</li>
              <li>Event and media management</li>
              ${role === "superadmin" ? "<li><strong>Creating other admin users</strong></li>" : ""}
              ${role === "superadmin" ? "<li><strong>Granting temporary admin access</strong></li>" : ""}
            </ul>
            
            <p style="margin-top: 30px;">
              <a href="${process.env.SITE_URL}/signin" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Login to Admin Dashboard</a>
            </p>
            
            <p>If you have any questions about your admin responsibilities, please don't hesitate to reach out.</p>
            
            <p>Welcome to the team!</p>
            <p>The RYWP Leadership</p>
            
            <hr style="margin-top: 40px; border: none; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #6b7280;">
              Rwanda Young Water Professionals<br>
              Email: info@rywp.org<br>
              Website: <a href="${process.env.SITE_URL}">${process.env.SITE_URL}</a>
            </p>
          </div>
        `,
      });

      if (error) {
        return { error: "Failed to send admin welcome email" };
      }

      return { success: true, emailId: data?.id };
    } catch (error) {
      console.error("Error sending admin welcome email:", error);
      return { error: "Failed to send admin welcome email" };
    }
  },
});

export const sendTemporaryAdminAccessEmail = internalAction({
  args: {
    to: v.string(),
    name: v.string(),
    expiresAt: v.number(),
  },
  handler: async (_ctx, { to, name, expiresAt }) => {
    try {
      const expiryDate = new Date(expiresAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Africa/Kigali'
      });

      const { data, error } = await resend.emails.send({
        from: "RYWP <noreply@rywp.org>",
        to: [to],
        subject: "Temporary Admin Access Granted - RYWP",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #059669;">Temporary Admin Access Granted!</h1>
            
            <p>Dear ${name},</p>
            
            <p>You have been granted temporary administrator access to the Rwanda Young Water Professionals (RYWP) platform.</p>
            
            <div style="background-color: #ecfdf5; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #059669;">
              <h3 style="color: #059669; margin-top: 0;">Access Details:</h3>
              <p><strong>Access Level:</strong> Temporary Administrator</p>
              <p><strong>Expires:</strong> ${expiryDate} (Rwanda Time)</p>
            </div>
            
            <p>With temporary admin access, you can:</p>
            <ul>
              <li>Manage content and publications</li>
              <li>Review membership applications</li>
              <li>Moderate hub activities</li>
              <li>Access administrative dashboards</li>
              <li>Manage events and media</li>
            </ul>
            
            <p style="background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong>Note:</strong> This access is temporary and will automatically expire on the date shown above. Please use this access responsibly and in accordance with RYWP policies.
            </p>
            
            <p style="margin-top: 30px;">
              <a href="${process.env.SITE_URL}/dashboard" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Access Admin Dashboard</a>
            </p>
            
            <p>If you have any questions about your temporary admin responsibilities, please contact the RYWP leadership team.</p>
            
            <p>Best regards,<br>The RYWP Leadership Team</p>
            
            <hr style="margin-top: 40px; border: none; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #6b7280;">
              Rwanda Young Water Professionals<br>
              Email: info@rywp.org<br>
              Website: <a href="${process.env.SITE_URL}">${process.env.SITE_URL}</a>
            </p>
          </div>
        `,
      });

      if (error) {
        return { error: "Failed to send temporary admin access email" };
      }

      return { success: true, emailId: data?.id };
    } catch (error) {
      console.error("Error sending temporary admin access email:", error);
      return { error: "Failed to send temporary admin access email" };
    }
  },
});