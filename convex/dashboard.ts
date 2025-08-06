import { v } from "convex/values";
import { query } from "./_generated/server";
import { getPermissions } from "./auth";

export const getAdminStats = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const permissions = await getPermissions(ctx, token);
    if (!permissions?.isGlobalAdmin()) {
      return { error: "Insufficient permissions" };
    }

    try {

      const totalUsers = await ctx.db.query("users").collect();
      const activeUsers = totalUsers.filter(user => user.isActive);
      const totalUsersCount = totalUsers.length;
      const activeUsersCount = activeUsers.length;

      const membershipApplications = await ctx.db.query("membershipApplications").collect();
      const pendingApplications = membershipApplications.filter(app => app.status === "pending");
      const approvedApplications = membershipApplications.filter(app => app.status === "approved");
      const rejectedApplications = membershipApplications.filter(app => app.status === "rejected");

      const hubs = await ctx.db.query("hubs").collect();
      const activeHubs = hubs.filter(hub => hub.isActive);

      const hubMemberships = await ctx.db.query("hubMemberships").collect();
      const approvedHubMemberships = hubMemberships.filter(membership => membership.status === "approved");

      const projects = await ctx.db.query("projects").collect();
      const activeProjects = projects.filter(project => project.isActive);
      const ongoingProjects = activeProjects.filter(project => project.status === "ongoing");
      const completedProjects = activeProjects.filter(project => project.status === "completed");

      const publications = await ctx.db.query("publications").collect();
      const publishedPublications = publications.filter(pub => pub.status === "published");
      const pendingPublications = publications.filter(pub => pub.status === "pending");

      const events = await ctx.db.query("events").collect();
      const activeEvents = events.filter(event => event.isActive);
      const upcomingEvents = activeEvents.filter(event => event.startDate > Date.now());
      const pastEvents = activeEvents.filter(event => event.endDate < Date.now());

      const partners = await ctx.db.query("partners").collect();
      const activePartners = partners.filter(partner => partner.isActive);

      const opportunities = await ctx.db.query("careerOpportunities").collect();
      const activeOpportunities = opportunities.filter(opp => opp.isActive);

      const newsletters = await ctx.db.query("newsletterSubscriptions").collect();
      const activeSubscriptions = newsletters.filter(sub => sub.isActive);

      const contactSubmissions = await ctx.db.query("contactSubmissions").collect();
      const unreadSubmissions = contactSubmissions.filter(sub => sub.status === "unread");

      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const recentUsers = activeUsers.filter(user => user.joinedAt > thirtyDaysAgo);
      const recentApplications = membershipApplications.filter(app => app.submittedAt > thirtyDaysAgo);
      const recentPublications = publishedPublications.filter(pub => pub.publishedAt && pub.publishedAt > thirtyDaysAgo);

      const projectsByStatus = [
        { status: "Ongoing", count: ongoingProjects.length, fill: "#76b9e6" },
        { status: "Completed", count: completedProjects.length, fill: "#29c3ec" },
      ];

      const publicationTypes = ["policy_brief", "article", "blog_post", "press_release", "technical_report"];
      const publicationsByType = publicationTypes.map(type => ({
        type: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        count: publishedPublications.filter(pub => pub.type === type).length,
        fill: type === "policy_brief" ? "#76b9e6" :
          type === "article" ? "#007eff" :
            type === "blog_post" ? "#29c3ec" :
              type === "press_release" ? "#0fccce" : "#a8dadc"
      }));

      const hubMembershipStats = await Promise.all(
        activeHubs.map(async (hub) => {
          const memberCount = approvedHubMemberships.filter(membership => membership.hubId === hub._id).length;
          return {
            hubName: hub.name,
            memberCount,
            fill: "#76b9e6"
          };
        })
      );

      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const startOfMonth = new Date();
        startOfMonth.setMonth(startOfMonth.getMonth() - i);
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);

        const monthName = startOfMonth.toLocaleString('default', { month: 'short' });
        const newMembers = activeUsers.filter(user =>
          user.joinedAt >= startOfMonth.getTime() && user.joinedAt < endOfMonth.getTime()
        ).length;

        const newProjects = activeProjects.filter(project =>
          project.createdAt >= startOfMonth.getTime() && project.createdAt < endOfMonth.getTime()
        ).length;

        monthlyData.push({
          month: monthName,
          members: newMembers,
          projects: newProjects
        });
      }

      return {
        success: true,
        data: {

          totalUsers: totalUsersCount,
          activeUsers: activeUsersCount,
          totalHubs: activeHubs.length,
          totalProjects: activeProjects.length,
          publishedPublications: publishedPublications.length,
          upcomingEvents: upcomingEvents.length,
          activePartners: activePartners.length,
          activeSubscriptions: activeSubscriptions.length,

          pendingApplications: pendingApplications.length,
          approvedApplications: approvedApplications.length,
          rejectedApplications: rejectedApplications.length,

          ongoingProjects: ongoingProjects.length,
          completedProjects: completedProjects.length,

          pendingPublications: pendingPublications.length,

          pastEvents: pastEvents.length,

          unreadSubmissions: unreadSubmissions.length,

          activeOpportunities: activeOpportunities.length,

          recentUsers: recentUsers.length,
          recentApplications: recentApplications.length,
          recentPublications: recentPublications.length,

          projectsByStatus,
          publicationsByType,
          hubMembershipStats,
          monthlyGrowth: monthlyData,
        }
      };
    } catch (error) {
      console.error("Failed to get admin stats:", error);
      return { error: "Failed to get admin statistics" };
    }
  },
});