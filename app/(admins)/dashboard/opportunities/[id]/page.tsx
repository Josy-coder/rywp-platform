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
  Mail,
  User,
  Briefcase,
  GraduationCap,
  FileText,
  Users,
  Download,
  Paperclip,
  Clock,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface CareerOpportunity {
  _id: string;
  title: string;
  description: string;
  type: "job" | "internship" | "fellowship" | "call_for_proposal";
  requirements: string;
  applicationDeadline: number;
  contactEmail: string;
  applicationLink?: string;
  attachmentIds: Id<"_storage">[]; // Storage IDs for file management
  attachments: (string | null)[]; // URLs for display
  isActive: boolean;
  createdAt: number;
  createdBy: string;
  
  creator?: {
    _id: string;
    name: string;
    email: string;
    profileImageId?: Id<"_storage">; // Storage ID for file management
    profileImage?: string | null; // URL for display
  };
}

function OpportunityDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-8 w-32" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex space-x-2">
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

export default function OpportunityDetailsPage() {
  const { user } = useAuth();
  const params = useParams();
  const opportunityId = params.id as string;

  const opportunityQuery = useQuery(
    api.careers.getCareerOpportunity,
    opportunityId ? { opportunityId: opportunityId as Id<"careerOpportunities"> } : "skip"
  );

  const isLoading = opportunityQuery === undefined;
  const opportunity = opportunityQuery?.data as CareerOpportunity | undefined;
  const error = opportunityQuery?.error;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "job":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "internship":
        return "bg-green-100 text-green-800 border-green-200";
      case "fellowship":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "call_for_proposal":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "call_for_proposal":
        return "Call for Proposal";
      case "job":
        return "Job";
      case "internship":
        return "Internship";
      case "fellowship":
        return "Fellowship";
      default:
        return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "job":
        return <Briefcase className="h-5 w-5 mr-2" />;
      case "internship":
        return <Users className="h-5 w-5 mr-2" />;
      case "fellowship":
        return <GraduationCap className="h-5 w-5 mr-2" />;
      case "call_for_proposal":
        return <FileText className="h-5 w-5 mr-2" />;
      default:
        return <Briefcase className="h-5 w-5 mr-2" />;
    }
  };

  const isOpportunityActive = (opportunity: CareerOpportunity) => {
    return opportunity.isActive && opportunity.applicationDeadline > Date.now();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline: number) => {
    const now = Date.now();
    const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <OpportunityDetailsSkeleton />
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/opportunities">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Opportunities
            </Link>
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || "Opportunity not found"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const daysLeft = getDaysUntilDeadline(opportunity.applicationDeadline);
  const isActive = isOpportunityActive(opportunity);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/opportunities">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Opportunities
            </Link>
          </Button>
        </div>

        {user?.isGlobalAdmin && (
          <Button asChild>
            <Link href={`/dashboard/opportunities?edit=${opportunity._id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Opportunity
            </Link>
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{opportunity.title}</h1>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className={`text-sm border ${getTypeColor(opportunity.type)}`}>
                  {getTypeIcon(opportunity.type)}
                  {getTypeLabel(opportunity.type)}
                </Badge>
                {isActive ? (
                  <Badge variant="default" className="text-sm bg-green-100 text-green-800 border-green-200">
                    <Clock className="h-4 w-4 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-sm bg-red-100 text-red-800 border-red-200">
                    <Clock className="h-4 w-4 mr-1" />
                    Expired
                  </Badge>
                )}
                {isActive && daysLeft <= 7 && daysLeft > 0 && (
                  <Badge variant="destructive" className="text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                  </Badge>
                )}
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
                  {opportunity.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements & Qualifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {opportunity.requirements}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Application Process */}
            <Card>
              <CardHeader>
                <CardTitle>How to Apply</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Contact Email</p>
                    <a 
                      href={`mailto:${opportunity.contactEmail}`}
                      className="text-primary hover:underline"
                    >
                      {opportunity.contactEmail}
                    </a>
                  </div>
                </div>

                {opportunity.applicationLink && (
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <ExternalLink className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Online Application</p>
                      <a 
                        href={opportunity.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center"
                      >
                        Apply Online
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Attachments */}
            {opportunity.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Paperclip className="h-5 w-5 mr-2" />
                    Attachments ({opportunity.attachments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {opportunity.attachments.map((url, index) => (
                      url && (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">
                              Attachment {index + 1}
                            </span>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        </div>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Creator */}
            {opportunity.creator && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Posted By
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    {opportunity.creator.profileImage ? (
                      <img
                        src={opportunity.creator.profileImage}
                        alt={opportunity.creator.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium">{opportunity.creator.name}</h4>
                      <p className="text-sm text-muted-foreground">{opportunity.creator.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Application Details */}
          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                <div className="mt-1">
                  <Badge className={`border ${getTypeColor(opportunity.type)}`}>
                    {getTypeIcon(opportunity.type)}
                    {getTypeLabel(opportunity.type)}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                <div className="mt-1">
                  {isActive ? (
                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                      <Clock className="h-4 w-4 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                      <Clock className="h-4 w-4 mr-1" />
                      Expired
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Application Deadline</Label>
                <div className="mt-1 flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{formatDate(opportunity.applicationDeadline)}</span>
                </div>
                {isActive && (
                  <div className="mt-2">
                    {daysLeft > 0 ? (
                      <p className={`text-sm ${daysLeft <= 7 ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                        {daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining
                      </p>
                    ) : (
                      <p className="text-sm text-red-600 font-medium">
                        Deadline has passed
                      </p>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Contact</Label>
                <div className="mt-1 flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a 
                    href={`mailto:${opportunity.contactEmail}`}
                    className="text-primary hover:underline"
                  >
                    {opportunity.contactEmail}
                  </a>
                </div>
              </div>

              {opportunity.attachments.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Attachments</Label>
                    <div className="mt-1 flex items-center text-sm">
                      <Paperclip className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{opportunity.attachments.length} document{opportunity.attachments.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Posted</Label>
                <p className="mt-1 text-sm">
                  {new Date(opportunity.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Apply Now</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {opportunity.applicationLink && (
                <Button asChild className="w-full">
                  <a
                    href={opportunity.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Apply Online
                  </a>
                </Button>
              )}

              <Button variant="outline" asChild className="w-full">
                <a href={`mailto:${opportunity.contactEmail}?subject=Application for ${opportunity.title}`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email Application
                </a>
              </Button>

              {user?.isGlobalAdmin && (
                <>
                  <Separator />
                  <Button asChild className="w-full" variant="outline">
                    <Link href={`/dashboard/opportunities?edit=${opportunity._id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Opportunity
                    </Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Related Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle>More Opportunities</CardTitle>
              <CardDescription>
                Other {getTypeLabel(opportunity.type).toLowerCase()}s available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild className="w-full">
                <Link href={`/dashboard/opportunities?type=${opportunity.type}`}>
                  {getTypeIcon(opportunity.type)}
                  View Similar Opportunities
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}