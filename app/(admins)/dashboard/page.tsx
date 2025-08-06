"use client";

import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Building2,
  FolderOpen,
  BookOpen,
  Calendar,
  UserCheck,
  AlertCircle,
  TrendingUp,
  Activity
} from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

export default function DashboardPage() {
  const { user, currentToken } = useAuth();
  const statsQuery = useQuery(
    api.dashboard.getAdminStats,
    user && currentToken ? { token: currentToken } : "skip"
  );

  if (!user) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Please sign in to access the dashboard.</AlertDescription>
      </Alert>
    );
  }

  if (statsQuery === undefined) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (statsQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{statsQuery.error}</AlertDescription>
      </Alert>
    );
  }

  const stats = statsQuery.data!;

  const projectsChartConfig = {
    ongoing: {
      label: "Ongoing",
      color: "#76b9e6",
    },
    completed: {
      label: "Completed",
      color: "#02c72e",
    },
  } satisfies ChartConfig;

  const publicationsChartConfig = {
    count: {
      label: "Publications",
      color: "#76b9e6",
    },
  } satisfies ChartConfig;

  const growthChartConfig = {
    members: {
      label: "New Members",
      color: "#083266",
    },
    projects: {
      label: "New Projects",
      color: "#29c3ec",
    },
  } satisfies ChartConfig;

  const hubsChartConfig = {
    memberCount: {
      label: "Members",
      color: "#0fccce",
    },
  } satisfies ChartConfig;

  const StatCard = ({
                      title,
                      value,
                      description,
                      icon: Icon,
                      trend
                    }: {
    title: string;
    value: number | string;
    description?: string;
    icon: any;
    trend?: { value: number; isPositive: boolean };
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp className={`h-3 w-3 mr-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`} />
            <span className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}% from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {user.isSuperAdmin ? "Super Admin" : user.isGlobalAdmin ? "Admin" : "Member"}
        </Badge>
      </div>

      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Members"
          value={stats.activeUsers}
          description={`${stats.totalUsers} total registered`}
          icon={Users}
          trend={{ value: stats.recentUsers, isPositive: stats.recentUsers > 0 }}
        />
        <StatCard
          title="Active Hubs"
          value={stats.totalHubs}
          description="Operational hubs"
          icon={Building2}
        />
        <StatCard
          title="Projects"
          value={stats.totalProjects}
          description={`${stats.ongoingProjects} ongoing, ${stats.completedProjects} completed`}
          icon={FolderOpen}
        />
        <StatCard
          title="Publications"
          value={stats.publishedPublications}
          description={`${stats.pendingPublications} pending review`}
          icon={BookOpen}
        />
      </div>

      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Applications"
          value={stats.pendingApplications}
          description="Membership applications"
          icon={UserCheck}
        />
        <StatCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          description="Scheduled events"
          icon={Calendar}
        />
        <StatCard
          title="Active Partners"
          value={stats.activePartners}
          description="Partner organizations"
          icon={Building2}
        />
        <StatCard
          title="Newsletter Subscribers"
          value={stats.activeSubscriptions}
          description="Active subscriptions"
          icon={Activity}
        />
      </div>

      
      <div className="grid gap-6 md:grid-cols-2">
        
        <Card>
          <CardHeader>
            <CardTitle>Projects by Status</CardTitle>
            <CardDescription>Distribution of project statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={projectsChartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={stats.projectsByStatus}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  {stats.projectsByStatus?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        
        <Card>
          <CardHeader>
            <CardTitle>Publications by Type</CardTitle>
            <CardDescription>Published content distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={publicationsChartConfig} className="min-h-[300px] w-full">
              <BarChart data={stats.publicationsByType}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="type"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 10)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      
      <div className="grid gap-6 md:grid-cols-2">
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Growth</CardTitle>
            <CardDescription>New members and projects over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={growthChartConfig} className="min-h-[300px] w-full">
              <LineChart data={stats.monthlyGrowth}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  dataKey="members"
                  type="monotone"
                  stroke="var(--color-members)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="projects"
                  type="monotone"
                  stroke="var(--color-projects)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        
        <Card>
          <CardHeader>
            <CardTitle>Hub Membership</CardTitle>
            <CardDescription>Members distribution across hubs</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={hubsChartConfig} className="min-h-[300px] w-full">
              <BarChart
                data={stats.hubMembershipStats}
                layout="horizontal"
                margin={{ left: 100 }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="hubName"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <XAxis type="number" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="memberCount" fill="var(--color-memberCount)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity (Last 30 Days)</CardTitle>
          <CardDescription>Summary of recent platform activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.recentUsers}</div>
              <div className="text-sm text-gray-600">New Members</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.recentApplications}</div>
              <div className="text-sm text-gray-600">New Applications</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.recentPublications}</div>
              <div className="text-sm text-gray-600">New Publications</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}