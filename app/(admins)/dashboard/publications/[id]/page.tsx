"use client";

import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  User,
  FileText,
  Tag,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

interface Publication {
  _id: Id<"publications">;
  _creationTime: number;
  title: string;
  content: string;
  type: "policy_brief" | "article" | "blog_post" | "press_release" | "technical_report";
  authorId: Id<"users">;
  status: "draft" | "pending" | "published";
  publishedAt?: number;
  featuredImage?: string | null; // URL for display
  attachments: (string | null)[]; // URLs for display
  tags: string[];
  isRestrictedAccess: boolean;
  createdAt: number;
  approvedBy?: Id<"users">;
  author?: {
    _id: Id<"users">;
    name: string;
    email: string;
    profileImage?: string | null; // URL for display
  } | null;
  approver?: {
    _id: Id<"users">;
    name: string;
    email: string;
  } | null;
}

function PublicationDetailsSkeleton() {
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
        </div>
      </div>
    </div>
  );
}

export default function PublicationDetailsPage() {
  const { user, currentToken } = useAuth();
  const params = useParams();
  const publicationId = params.id as string;

  const publicationQuery = useQuery(
    api.publications.getPublication,
    publicationId ? { publicationId: publicationId as Id<"publications"> } : "skip"
  );

  const reviewPublication = useMutation(api.publications.reviewPublication);

  const isLoading = publicationQuery === undefined;
  const publication = publicationQuery?.data as Publication | undefined;
  const error = publicationQuery?.error;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "draft":
        return <Edit className="h-4 w-4" />;
      default:
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "policy_brief":
        return "Policy Brief";
      case "article":
        return "Article";
      case "blog_post":
        return "Blog Post";
      case "press_release":
        return "Press Release";
      case "technical_report":
        return "Technical Report";
      default:
        return type;
      }
    };

    const handleReviewPublication = async (status: "published" | "rejected") => {
      if (!user?.isGlobalAdmin || !currentToken || !publication) return;

      try {
        const result = await reviewPublication({
          publicationId: publication._id,
          status,
          token: currentToken,
        });

        if (result.success) {
          toast.success(`Publication ${status} successfully!`);
        } else {
          toast.error(result.error || `Failed to ${status.toLowerCase()} publication`);
        }
      } catch (error) {
        console.error("Error reviewing publication:", error);
        toast.error("An unexpected error occurred");
      }
    };

    if (isLoading) {
      return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <PublicationDetailsSkeleton />
        </div>
      );
    }

    if (error || !publication) {
      return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/publications">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Publications
              </Link>
            </Button>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || "Publication not found"}
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    const canEdit = publication.authorId === user?.id || user?.isGlobalAdmin;
    const canReview = user?.isGlobalAdmin && publication.status === "pending";

    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/publications">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Publications
              </Link>
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {canReview && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleReviewPublication("rejected")}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleReviewPublication("published")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Publish
                </Button>
              </>
            )}
            {canEdit && (
              <Button asChild>
                <Link href={`/dashboard/publications?edit=${publication._id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Publication
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {publication.featuredImage ? (
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <Image
                  src={publication.featuredImage}
                  alt={publication.title}
                  fill
                  className="object-cover"
                />
                {publication.isRestrictedAccess && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="destructive">
                      Restricted Access
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No featured image</p>
                </div>
              </div>
            )}

            
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{publication.title}</h1>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="outline" className="text-sm">
                    {getTypeLabel(publication.type)}
                  </Badge>
                  <Badge className={`text-sm border ${getStatusColor(publication.status)}`}>
                    {getStatusIcon(publication.status)}
                    <span className="ml-1">{publication.status}</span>
                  </Badge>
                  {publication.isRestrictedAccess && (
                    <Badge variant="destructive" className="text-sm">
                      Restricted Access
                    </Badge>
                  )}
                </div>

                <div className="prose max-w-none">
                  <div
                    className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: publication.content }}
                  />
                </div>
              </div>

              
              {publication.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Tag className="h-5 w-5 mr-2" />
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {publication.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              
              {publication.attachments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Attachments ({publication.attachments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {publication.attachments.filter(Boolean).map((attachmentUrl, index) => (
                        <div
                          key={attachmentUrl!}
                          className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">
                                Attachment {index + 1}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Click to download
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={attachmentUrl!}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          
          <div className="space-y-6">
            
            <Card>
              <CardHeader>
                <CardTitle>Publication Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge className={`border ${getStatusColor(publication.status)}`}>
                      {getStatusIcon(publication.status)}
                      <span className="ml-1">{publication.status}</span>
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                  <p className="mt-1 text-sm font-medium">{getTypeLabel(publication.type)}</p>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Author</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{publication.author?.name}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Timeline</Label>
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Created: {new Date(publication.createdAt).toLocaleDateString()}</span>
                    </div>
                    {publication.publishedAt && (
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Published: {new Date(publication.publishedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {publication.approver && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Approved By</Label>
                      <div className="mt-1 flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{publication.approver.name}</span>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Access</Label>
                  <p className="mt-1 text-sm">
                    {publication.isRestrictedAccess ? "Restricted" : "Public"}
                  </p>
                </div>
              </CardContent>
            </Card>

            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {canEdit && (
                  <Button asChild className="w-full">
                    <Link href={`/dashboard/publications?edit=${publication._id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Publication
                    </Link>
                  </Button>
                )}

                <Button variant="outline" asChild className="w-full">
                  <Link href="/dashboard/publications">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Publications
                  </Link>
                </Button>

                {publication.status === "published" && (
                  <Button variant="outline" asChild className="w-full">
                    <Link href={`/publications/${publication._id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Public Page
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            
            <Card>
              <CardHeader>
                <CardTitle>Related</CardTitle>
                <CardDescription>
                  Other {getTypeLabel(publication.type).toLowerCase()}s
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/dashboard/publications?type=${publication.type}`}>
                    <FileText className="h-4 w-4 mr-2" />
                    View Similar Publications
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }