"use client";

import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertCircle,
  Calendar,
  Edit,
  Eye,
  FolderOpen,
  Loader2,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Clock,
  Trash2,
  Users,
  Briefcase,
  GraduationCap,
  FileText,
  ExternalLink,
  Paperclip,
} from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import FileUpload from "@/components/ui/file-upload";

interface CareerOpportunity {
  _id: Id<"careerOpportunities">;
  _creationTime: number;
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
  createdBy: Id<"users">;

  creator?: {
    _id: Id<"users">;
    name: string;
    email: string;
    profileImageId?: Id<"_storage">; // Storage ID for file management
    profileImage?: string | null; // URL for display
  } | null;
}

interface UploadedFile {
  _id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  storageId: string;
}

function OpportunityCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const OpportunitiesPageContent = () => {
  const { user, currentToken } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const editParam = searchParams.get('edit');
  const typeParam = searchParams.get('type');

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "job" | "internship" | "fellowship" | "call_for_proposal">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "expired">("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<CareerOpportunity | null>(null);
  const [deletingOpportunity, setDeletingOpportunity] = useState<CareerOpportunity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const opportunitiesQuery = useQuery(api.careers.getCareerOpportunities, { activeOnly: false });

  const createOpportunity = useMutation(api.careers.createCareerOpportunity);
  const updateOpportunity = useMutation(api.careers.updateCareerOpportunity);
  const deleteOpportunity = useMutation(api.careers.deleteCareerOpportunity);

  useEffect(() => {
    if (typeParam && ["job", "internship", "fellowship", "call_for_proposal"].includes(typeParam)) {
      setTypeFilter(typeParam as any);
    }
  }, [typeParam]);

  useEffect(() => {
    if (!opportunitiesQuery?.data || !editParam || !user?.isGlobalAdmin) return;

    const opportunityToEdit = opportunitiesQuery.data.find((o: CareerOpportunity) => o._id === editParam);
    if (opportunityToEdit) {
      setEditingOpportunity(opportunityToEdit);
      setOpportunityForm({
        title: opportunityToEdit.title,
        description: opportunityToEdit.description,
        type: opportunityToEdit.type,
        requirements: opportunityToEdit.requirements,
        applicationDeadline: new Date(opportunityToEdit.applicationDeadline).toISOString().split('T')[0],
        contactEmail: opportunityToEdit.contactEmail,
        applicationLink: opportunityToEdit.applicationLink || "",
      });
      
      // Set up attachments using both IDs and URLs
      const currentAttachments = opportunityToEdit.attachmentIds.map((id, index) => ({
        _id: id,
        name: `Attachment ${index + 1}`,
        size: 0,
        type: "application/pdf",
        storageId: id,
        url: opportunityToEdit.attachments[index] || undefined,
      }));
      setAttachments(currentAttachments);
      setShowEditDialog(true);

      const newParams = new URLSearchParams(searchParams);
      newParams.delete('edit');
      const newUrl = newParams.toString() ? `?${newParams.toString()}` : '/dashboard/opportunities';
      router.replace(newUrl, { scroll: false });
    }
  }, [opportunitiesQuery?.data, editParam, user?.isGlobalAdmin, searchParams, router]);

  const [opportunityForm, setOpportunityForm] = useState({
    title: "",
    description: "",
    type: "job" as CareerOpportunity["type"],
    requirements: "",
    applicationDeadline: "",
    contactEmail: "",
    applicationLink: "",
  });

  const [attachments, setAttachments] = useState<UploadedFile[]>([]);

  const isInitialLoading = opportunitiesQuery === undefined;

  const filteredOpportunities = useMemo(() => {
    if (!opportunitiesQuery?.data) return [];

    return opportunitiesQuery.data.filter((opportunity: CareerOpportunity) => {
      // Search filter
      if (debouncedSearchTerm) {
        const searchLower = debouncedSearchTerm.toLowerCase();
        const matchesSearch =
          opportunity.title.toLowerCase().includes(searchLower) ||
          opportunity.description.toLowerCase().includes(searchLower) ||
          opportunity.requirements.toLowerCase().includes(searchLower) ||
          opportunity.contactEmail.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Type filter
      if (typeFilter !== "all" && opportunity.type !== typeFilter) return false;

      // Status filter
      if (statusFilter === "active" && (!opportunity.isActive || opportunity.applicationDeadline <= Date.now())) return false;
      if (statusFilter === "expired" && (opportunity.applicationDeadline > Date.now() || !opportunity.isActive)) return false;

      return true;
    });
  }, [opportunitiesQuery, debouncedSearchTerm, typeFilter, statusFilter]);

  const resetForm = () => {
    setOpportunityForm({
      title: "",
      description: "",
      type: "job",
      requirements: "",
      applicationDeadline: "",
      contactEmail: "",
      applicationLink: "",
    });
    setAttachments([]);
    setError(null);
  };

  const handleCreateOpportunity = async () => {
    if (!currentToken) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await createOpportunity({
        title: opportunityForm.title,
        description: opportunityForm.description,
        type: opportunityForm.type,
        requirements: opportunityForm.requirements,
        applicationDeadline: new Date(opportunityForm.applicationDeadline).getTime(),
        contactEmail: opportunityForm.contactEmail,
        applicationLink: opportunityForm.applicationLink || undefined,
        attachments: attachments.map(file => file.storageId as Id<"_storage">),
        token: currentToken,
      });

      if (result.success) {
        toast.success("Opportunity created successfully!");
        setShowCreateDialog(false);
        resetForm();
      } else {
        setError(result.error || "Failed to create opportunity");
      }
    } catch (error) {
      console.error("Error creating opportunity:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOpportunity = async () => {
    if (!currentToken || !editingOpportunity) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await updateOpportunity({
        opportunityId: editingOpportunity._id,
        title: opportunityForm.title,
        description: opportunityForm.description,
        requirements: opportunityForm.requirements,
        applicationDeadline: new Date(opportunityForm.applicationDeadline).getTime(),
        contactEmail: opportunityForm.contactEmail,
        applicationLink: opportunityForm.applicationLink || undefined,
        attachments: attachments.map(file => file.storageId as Id<"_storage">),
        token: currentToken,
      });

      if (result.success) {
        toast.success("Opportunity updated successfully!");
        setShowEditDialog(false);
        setEditingOpportunity(null);
        resetForm();
      } else {
        setError(result.error || "Failed to update opportunity");
      }
    } catch (error) {
      console.error("Error updating opportunity:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOpportunity = async () => {
    if (!currentToken || !deletingOpportunity) return;

    setIsLoading(true);
    try {
      const result = await deleteOpportunity({
        opportunityId: deletingOpportunity._id,
        token: currentToken,
      });

      if (result.success) {
        toast.success("Opportunity deleted successfully!");
        setShowDeleteDialog(false);
        setDeletingOpportunity(null);
      } else {
        setError(result.error || "Failed to delete opportunity");
      }
    } catch (error) {
      console.error("Error deleting opportunity:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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
        return <Briefcase className="h-4 w-4" />;
      case "internship":
        return <Users className="h-4 w-4" />;
      case "fellowship":
        return <GraduationCap className="h-4 w-4" />;
      case "call_for_proposal":
        return <FileText className="h-4 w-4" />;
      default:
        return <Briefcase className="h-4 w-4" />;
    }
  };

  const isOpportunityActive = (opportunity: CareerOpportunity) => {
    return opportunity.isActive && opportunity.applicationDeadline > Date.now();
  };

  if (!user) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please sign in to access opportunities management.
        </AlertDescription>
      </Alert>
    );
  }

  if (isInitialLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <OpportunityCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Career Opportunities</h1>
          <p className="text-gray-600">
            Manage job postings, internships, fellowships, and calls for proposals
          </p>
        </div>
        {user.isGlobalAdmin && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create Opportunity
              </Button>
            </DialogTrigger>
          </Dialog>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            All Opportunities ({filteredOpportunities.length})
          </h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={typeFilter} onValueChange={(value: "all" | "job" | "internship" | "fellowship" | "call_for_proposal") => setTypeFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="job">Jobs</SelectItem>
                <SelectItem value="internship">Internships</SelectItem>
                <SelectItem value="fellowship">Fellowships</SelectItem>
                <SelectItem value="call_for_proposal">Calls for Proposals</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value: "all" | "active" | "expired") => setStatusFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredOpportunities.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                  ? "No opportunities found matching your criteria"
                  : "No opportunities found"}
              </p>
              {!searchTerm && user.isGlobalAdmin && (
                <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Opportunity
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOpportunities.map((opportunity: CareerOpportunity) => (
              <Card key={opportunity._id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg line-clamp-1 mb-2">{opportunity.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs border ${getTypeColor(opportunity.type)}`}>
                          {getTypeIcon(opportunity.type)}
                          <span className="ml-1">{getTypeLabel(opportunity.type)}</span>
                        </Badge>
                        {isOpportunityActive(opportunity) ? (
                          <Badge variant="default" className="text-xs bg-green-100 text-green-800 border-green-200">
                            <Clock className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs bg-red-100 text-red-800 border-red-200">
                            <Clock className="h-3 w-3 mr-1" />
                            Expired
                          </Badge>
                        )}
                      </div>
                    </div>
                    {user.isGlobalAdmin && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/opportunities/${opportunity._id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingOpportunity(opportunity);
                              setOpportunityForm({
                                title: opportunity.title,
                                description: opportunity.description,
                                type: opportunity.type,
                                requirements: opportunity.requirements,
                                applicationDeadline: new Date(opportunity.applicationDeadline).toISOString().split('T')[0],
                                contactEmail: opportunity.contactEmail,
                                applicationLink: opportunity.applicationLink || "",
                              });
                              
                              // Set up attachments using both IDs and URLs
                              const currentAttachments = opportunity.attachmentIds.map((id, index) => ({
                                _id: id,
                                name: `Attachment ${index + 1}`,
                                size: 0,
                                type: "application/pdf",
                                storageId: id,
                                url: opportunity.attachments[index] || undefined,
                              }));
                              setAttachments(currentAttachments);
                              setShowEditDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setDeletingOpportunity(opportunity);
                              setShowDeleteDialog(true);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="line-clamp-2 mb-3">
                    {opportunity.description}
                  </CardDescription>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span>
                        Deadline: {new Date(opportunity.applicationDeadline).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="truncate">{opportunity.contactEmail}</span>
                    </div>
                    {opportunity.attachments.length > 0 && (
                      <div className="flex items-center">
                        <Paperclip className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span>{opportunity.attachments.length} attachment{opportunity.attachments.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {opportunity.applicationLink && (
                      <div className="flex items-center">
                        <ExternalLink className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span className="truncate">Online Application</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <Link href={`/dashboard/opportunities/${opportunity._id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Opportunity
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Opportunity Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>Create New Opportunity</DialogTitle>
            <DialogDescription>
              Add a new career opportunity, internship, fellowship, or call for proposal.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={opportunityForm.title}
                    onChange={(e) =>
                      setOpportunityForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Enter opportunity title"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={opportunityForm.description}
                    onChange={(e) =>
                      setOpportunityForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Describe the opportunity..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={opportunityForm.type}
                    onValueChange={(value: CareerOpportunity["type"]) =>
                      setOpportunityForm((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="job">Job</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="fellowship">Fellowship</SelectItem>
                      <SelectItem value="call_for_proposal">Call for Proposal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="applicationDeadline">Application Deadline *</Label>
                  <Input
                    id="applicationDeadline"
                    type="date"
                    value={opportunityForm.applicationDeadline}
                    onChange={(e) =>
                      setOpportunityForm((prev) => ({ ...prev, applicationDeadline: e.target.value }))
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="requirements">Requirements *</Label>
                  <Textarea
                    id="requirements"
                    value={opportunityForm.requirements}
                    onChange={(e) =>
                      setOpportunityForm((prev) => ({ ...prev, requirements: e.target.value }))
                    }
                    placeholder="List the requirements and qualifications..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={opportunityForm.contactEmail}
                    onChange={(e) =>
                      setOpportunityForm((prev) => ({ ...prev, contactEmail: e.target.value }))
                    }
                    placeholder="contact@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="applicationLink">Application Link</Label>
                  <Input
                    id="applicationLink"
                    type="url"
                    value={opportunityForm.applicationLink}
                    onChange={(e) =>
                      setOpportunityForm((prev) => ({ ...prev, applicationLink: e.target.value }))
                    }
                    placeholder="https://example.com/apply"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attachments" className="space-y-4">
              <FileUpload
                label="Attachments"
                description="Upload relevant documents (job descriptions, application forms, etc.)"
                accept=".pdf,.doc,.docx,.txt"
                multiple={true}
                maxFiles={5}
                maxSize={10}
                currentFiles={attachments}
                onFilesChange={setAttachments}
                onError={(error) => setError(error)}
              />
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateOpportunity}
              disabled={
                isLoading ||
                !opportunityForm.title ||
                !opportunityForm.description ||
                !opportunityForm.requirements ||
                !opportunityForm.applicationDeadline ||
                !opportunityForm.contactEmail
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Opportunity"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Opportunity Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>Edit Opportunity</DialogTitle>
            <DialogDescription>
              Update opportunity information and settings.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="edit-title">Title *</Label>
                  <Input
                    id="edit-title"
                    value={opportunityForm.title}
                    onChange={(e) =>
                      setOpportunityForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Enter opportunity title"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-description">Description *</Label>
                  <Textarea
                    id="edit-description"
                    value={opportunityForm.description}
                    onChange={(e) =>
                      setOpportunityForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Describe the opportunity..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-type">Type *</Label>
                  <Select
                    value={opportunityForm.type}
                    onValueChange={(value: CareerOpportunity["type"]) =>
                      setOpportunityForm((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="job">Job</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="fellowship">Fellowship</SelectItem>
                      <SelectItem value="call_for_proposal">Call for Proposal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-applicationDeadline">Application Deadline *</Label>
                  <Input
                    id="edit-applicationDeadline"
                    type="date"
                    value={opportunityForm.applicationDeadline}
                    onChange={(e) =>
                      setOpportunityForm((prev) => ({ ...prev, applicationDeadline: e.target.value }))
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="edit-requirements">Requirements *</Label>
                  <Textarea
                    id="edit-requirements"
                    value={opportunityForm.requirements}
                    onChange={(e) =>
                      setOpportunityForm((prev) => ({ ...prev, requirements: e.target.value }))
                    }
                    placeholder="List the requirements and qualifications..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-contactEmail">Contact Email *</Label>
                  <Input
                    id="edit-contactEmail"
                    type="email"
                    value={opportunityForm.contactEmail}
                    onChange={(e) =>
                      setOpportunityForm((prev) => ({ ...prev, contactEmail: e.target.value }))
                    }
                    placeholder="contact@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-applicationLink">Application Link</Label>
                  <Input
                    id="edit-applicationLink"
                    type="url"
                    value={opportunityForm.applicationLink}
                    onChange={(e) =>
                      setOpportunityForm((prev) => ({ ...prev, applicationLink: e.target.value }))
                    }
                    placeholder="https://example.com/apply"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attachments" className="space-y-4">
              <FileUpload
                label="Attachments"
                description="Upload relevant documents (job descriptions, application forms, etc.)"
                accept=".pdf,.doc,.docx,.txt"
                multiple={true}
                maxFiles={5}
                maxSize={10}
                currentFiles={attachments}
                onFilesChange={setAttachments}
                onError={(error) => setError(error)}
              />
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setEditingOpportunity(null);
                resetForm();
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateOpportunity}
              disabled={
                isLoading ||
                !opportunityForm.title ||
                !opportunityForm.description ||
                !opportunityForm.requirements ||
                !opportunityForm.applicationDeadline ||
                !opportunityForm.contactEmail
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Opportunity"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Opportunity Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Opportunity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deletingOpportunity?.title}</span>? This
              action cannot be undone and will remove the opportunity permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false);
                setDeletingOpportunity(null);
                setError(null);
              }}
              disabled={isLoading}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOpportunity}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Opportunity"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={<OpportunityCardSkeleton />}>
      <OpportunitiesPageContent />
    </Suspense>
  );
};