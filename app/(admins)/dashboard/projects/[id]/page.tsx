"use client";

import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  AlertCircle,
  Calendar,
  Edit,
  ExternalLink,
  Globe,
  MapPin,
  Star,
  Users,
  Building2,
  User,
  ImageIcon,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface Project {
  _id: string;
  title: string;
  description: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  status: "ongoing" | "completed";
  theme: string;
  hubId: string;
  partnerIds: string[];
  featuredImage?: string;
  startDate: number;
  endDate?: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: number;
  createdBy: string;
  hub?: {
    _id: string;
    name: string;
  };
  partners?: Array<{
    _id: string;
    name: string;
    logo?: string;
    website?: string;
  }>;
  creator?: {
    _id: string;
    name: string;
    email: string;
  };
}

// Skeleton Components
function ProjectDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-8 w-32" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex space-x-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailsPage() {
  const { user } = useAuth();
  const params = useParams();
  const projectId = params.id as string;

  const projectQuery = useQuery(
    api.projects.getProject,
    projectId ? { projectId: projectId as Id<"projects"> } : "skip"
  );

  const isLoading = projectQuery === undefined;
  const project = projectQuery?.data as Project | undefined;
  const error = projectQuery?.error;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <ProjectDetailsSkeleton />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || "Project not found"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>

        {user?.isGlobalAdmin && (
          <Button asChild>
            <Link href={`/dashboard/projects?edit=${project._id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Image */}
          {project.featuredImage ? (
            <div className="aspect-video relative overflow-hidden rounded-lg">
              <img
                src={project.featuredImage}
                alt={project.title}
                className="object-cover w-full h-full"
              />
              {project.isFeatured && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-yellow-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No image available</p>
              </div>
            </div>
          )}

          {/* Project Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline" className="text-sm">
                  <Building2 className="h-3 w-3 mr-1" />
                  {project.hub?.name}
                </Badge>
                <Badge className={`text-sm border ${getStatusColor(project.status)}`}>
                  {project.status}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {project.theme}
                </Badge>
                {project.isFeatured && (
                  <Badge className="bg-yellow-500 text-white text-sm">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>

              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Location & Coordinates */}
            {(project.location || project.coordinates) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-2">{project.location}</p>
                  {project.coordinates && (
                    <p className="text-sm text-muted-foreground">
                      Coordinates: {project.coordinates.lat.toFixed(6)}, {project.coordinates.lng.toFixed(6)}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Partners */}
            {project.partners && project.partners.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Partners ({project.partners.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {project.partners.map((partner) => (
                      <div key={partner._id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        {partner.logo ? (
                          <img
                            src={partner.logo}
                            alt={`${partner.name} logo`}
                            className="h-10 w-10 object-contain rounded border"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{partner.name}</h4>
                          {partner.website && (
                            <a
                              href={partner.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline flex items-center mt-1"
                            >
                              <Globe className="h-3 w-3 mr-1" />
                              <span className="truncate">
                                {partner.website.replace(/^https?:\/\//, "")}
                              </span>
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                <div className="mt-1">
                  <Badge className={`border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Timeline</Label>
                <div className="mt-1 space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                  {project.endDate && (
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Ended: {new Date(project.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Theme</Label>
                <p className="mt-1 text-sm">{project.theme}</p>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Hub</Label>
                <p className="mt-1 text-sm font-medium">{project.hub?.name}</p>
              </div>

              {project.creator && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Created By</Label>
                    <div className="mt-1 flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{project.creator.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {user?.isGlobalAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full">
                  <Link href={`/dashboard/projects?edit=${project._id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Project
                  </Link>
                </Button>

                <Button variant="outline" asChild className="w-full">
                  <Link href="/projects">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go to Projects (Website view)
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Related Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Hub Projects</CardTitle>
              <CardDescription>
                Other projects from {project.hub?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild className="w-full">
                <Link href={`/dashboard/projects?hub=${project.hubId}`}>
                  <Building2 className="h-4 w-4 mr-2" />
                  View Hub Projects
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}