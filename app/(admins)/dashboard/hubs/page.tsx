"use client";

import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
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
  Building2,
  CheckCircle,
  Download,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Search,
  UserCheck,
  Users,
  XCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import FileUpload from "@/components/ui/file-upload";

interface Hub {
  _id: string;
  name: string;
  description: string;
  objectives: string;
  memberCount: number;
  isActive: boolean;
  createdAt: number;
  createdBy: string;
  image?: string;
  termsOfReference?: string;
  membershipFormFields: any[];
}

interface HubApplication {
  _id: string;
  userId: string;
  hubId: string;
  role: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: number;
  reviewedAt?: number;
  notes?: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  hub?: {
    _id: string;
    name: string;
  };
  reviewer?: {
    _id: string;
    name: string;
  };
}

interface UploadedFile {
  _id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  storageId: string;
}

interface MembershipFormField {
  id: string;
  label: string;
  type: "text" | "email" | "textarea" | "select" | "radio" | "checkbox" | "tel" | "url" | "number" | "date" | "file";
  required: boolean;
  options?: string[];
  placeholder?: string;
  fileTypes?: string[];
  maxFileSize?: number;
  multiple?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

function HubCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  );
}

function ApplicationCardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HubsPage() {
  const { user, currentToken } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"pending" | "approved" | "rejected">("pending");
  const [selectedHub, setSelectedHub] = useState<string>("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingHub, setEditingHub] = useState<Hub | null>(null);
  const [reviewingApplication, setReviewingApplication] = useState<HubApplication | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const hubsQuery = useQuery(api.hubs.getHubs, { activeOnly: false });

  const washHub = hubsQuery?.data?.find(hub =>
    hub.name.toLowerCase().includes("wash")
  );
  const defaultHubId = washHub?._id;

  useEffect(() => {
    if (defaultHubId && !selectedHub) {
      setSelectedHub(defaultHubId);
    }
  }, [defaultHubId, selectedHub]);

  const hubApplicationsQuery = useQuery(
    api.hubs.getHubApplications,
    currentToken && selectedHub
      ? {
        paginationOpts: { numItems: 20, cursor: null },
        hubId: selectedHub as Id<"hubs">,
        status: statusFilter,
        search: debouncedSearchTerm,
        token: currentToken,
      }
      : "skip",
  );

  const createHub = useMutation(api.hubs.createHub);
  const updateHub = useMutation(api.hubs.updateHub);
  const reviewApplication = useMutation(api.hubs.reviewHubApplication);
  const uploadHubImage = useMutation(api.files.uploadHubImage);
  const uploadHubTermsOfReference = useMutation(api.files.uploadHubTermsOfReference);
  const removeHubImage = useMutation(api.files.removeHubImage);
  const removeHubTermsOfReference = useMutation(api.files.removeHubTermsOfReference);

  const [hubForm, setHubForm] = useState({
    name: "",
    description: "",
    objectives: "",
    membershipFormFields: [] as MembershipFormField[],
  });

  const [hubFiles, setHubFiles] = useState({
    image: [] as UploadedFile[],
    termsOfReference: [] as UploadedFile[],
  });

  const [reviewForm, setReviewForm] = useState({
    status: "approved" as "approved" | "rejected",
    notes: "",
  });

  if (!user) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please sign in to access hub management.
        </AlertDescription>
      </Alert>
    );
  }

  if (!user.isGlobalAdmin) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You need admin privileges to manage hubs.
        </AlertDescription>
      </Alert>
    );
  }

  const isInitialLoading = hubsQuery === undefined;
  const isApplicationsLoading = selectedHub && hubApplicationsQuery === undefined;

  const filteredHubs =
    hubsQuery?.data?.filter((hub: Hub) => {
      return (
        hub.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        hub.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }) || [];

  const resetForm = () => {
    setHubForm({
      name: "",
      description: "",
      objectives: "",
      membershipFormFields: [
        {
          id: "motivation",
          label: "Why do you want to join this hub?",
          type: "textarea",
          required: true,
          placeholder: "Tell us about your motivation and how you can contribute...",
        },
        {
          id: "experience",
          label: "Relevant Experience",
          type: "textarea",
          required: true,
          placeholder: "Describe your relevant experience in this field...",
        },
      ],
    });
    setHubFiles({
      image: [],
      termsOfReference: [],
    });
  };

  const handleCreateHub = async () => {
    if (!currentToken) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await createHub({
        ...hubForm,
        membershipFormFields: hubForm.membershipFormFields,
        image: hubFiles.image[0]?.storageId as Id<"_storage"> | undefined,
        termsOfReference: hubFiles.termsOfReference[0]?.storageId as Id<"_storage"> | undefined,
        token: currentToken,
      });

      if (result.success) {
        toast.success("Hub created successfully!");
        setShowCreateDialog(false);
        resetForm();
      } else {
        setError(result.error || "Failed to create hub");
      }
    } catch (error) {
      console.error("Error creating hub:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateHub = async () => {
    if (!currentToken || !editingHub) return;

    setIsLoading(true);
    setError(null);
    try {

      if (hubFiles.image.length > 0 && hubFiles.image[0].storageId !== editingHub.image) {
        const imageResult = await uploadHubImage({
          hubId: editingHub._id as Id<"hubs">,
          imageId: hubFiles.image[0].storageId as Id<"_storage">,
          token: currentToken,
        });
        if (!imageResult.success) {
          throw new Error(imageResult.error);
        }
      }

      if (hubFiles.termsOfReference.length > 0 && hubFiles.termsOfReference[0].storageId !== editingHub.termsOfReference) {
        const torResult = await uploadHubTermsOfReference({
          hubId: editingHub._id as Id<"hubs">,
          fileId: hubFiles.termsOfReference[0].storageId as Id<"_storage">,
          token: currentToken,
        });
        if (!torResult.success) {
          throw new Error(torResult.error);
        }
      }

      const result = await updateHub({
        hubId: editingHub._id as Id<"hubs">,
        ...hubForm,
        membershipFormFields: hubForm.membershipFormFields,
        token: currentToken,
      });

      if (result.success) {
        toast.success("Hub updated successfully!");
        setShowEditDialog(false);
        setEditingHub(null);
        resetForm();
      } else {
        setError(result.error || "Failed to update hub");
      }
    } catch (error) {
      console.error("Error updating hub:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewApplication = async () => {
    if (!currentToken || !reviewingApplication) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await reviewApplication({
        applicationId: reviewingApplication._id as Id<"hubMemberships">,
        status: reviewForm.status,
        notes: reviewForm.notes,
        token: currentToken,
      });

      if (result.success) {
        toast.success(`Application ${reviewForm.status} successfully!`);
        setReviewingApplication(null);
        setReviewForm({ status: "approved", notes: "" });
      } else {
        setError(result.error || "Failed to review application");
      }
    } catch (error) {
      console.error("Error reviewing application:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveHubImage = async (hubId: string) => {
    if (!currentToken) return;

    try {
      const result = await removeHubImage({
        hubId: hubId as Id<"hubs">,
        token: currentToken,
      });

      if (result.success) {
        toast.success("Hub image removed successfully!");
        setHubFiles(prev => ({ ...prev, image: [] }));
      } else {
        toast.error(result.error || "Failed to remove hub image");
      }
    } catch (error) {
      console.error("Error removing hub image:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleRemoveHubTermsOfReference = async (hubId: string) => {
    if (!currentToken) return;

    try {
      const result = await removeHubTermsOfReference({
        hubId: hubId as Id<"hubs">,
        token: currentToken,
      });

      if (result.success) {
        toast.success("Terms of reference removed successfully!");
        setHubFiles(prev => ({ ...prev, termsOfReference: [] }));
      } else {
        toast.error(result.error || "Failed to remove terms of reference");
      }
    } catch (error) {
      console.error("Error removing terms of reference:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const addFormField = () => {
    const newField: MembershipFormField = {
      id: `field_${Date.now()}`,
      label: "",
      type: "text",
      required: false,
      placeholder: "",
    };
    setHubForm(prev => ({
      ...prev,
      membershipFormFields: [...prev.membershipFormFields, newField],
    }));
  };

  const updateFormField = (index: number, field: Partial<MembershipFormField>) => {
    setHubForm(prev => ({
      ...prev,
      membershipFormFields: prev.membershipFormFields.map((f, i) =>
        i === index ? { ...f, ...field } : f
      ),
    }));
  };

  const removeFormField = (index: number) => {
    setHubForm(prev => ({
      ...prev,
      membershipFormFields: prev.membershipFormFields.filter((_, i) => i !== index),
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isInitialLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <HubCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hub Management</h1>
          <p className="text-gray-600">
            Manage RYWP hubs and review membership applications
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Hub
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Active Hubs</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search hubs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredHubs.map((hub: Hub) => (
            <Card
              key={hub._id}
              className={`transition-all hover:shadow-md ${!hub.isActive ? "opacity-60" : ""}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <span>{hub.name}</span>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {hub.description}
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{hub.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Description</h4>
                          <p className="text-sm text-muted-foreground">
                            {hub.description}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Objectives</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {hub.objectives}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditingHub(hub);
                              setHubForm({
                                name: hub.name,
                                description: hub.description,
                                objectives: hub.objectives,
                                membershipFormFields: hub.membershipFormFields || [],
                              });
                              setHubFiles({
                                image: hub.image ? [{
                                  _id: hub.image,
                                  name: "Current Image",
                                  size: 0,
                                  type: "image/*",
                                  storageId: hub.image,
                                }] : [],
                                termsOfReference: hub.termsOfReference ? [{
                                  _id: hub.termsOfReference,
                                  name: "Current Terms of Reference",
                                  size: 0,
                                  type: "application/pdf",
                                  storageId: hub.termsOfReference,
                                }] : [],
                              });
                              setShowEditDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          {hub.termsOfReference && (
                            <Button variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              ToR
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {hub.memberCount} member{hub.memberCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <Badge className={hub.isActive ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800"}>
                    {hub.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Hub Applications</h2>
          <div className="flex items-center space-x-2">
            <Select value={statusFilter} onValueChange={(value: "pending" | "approved" | "rejected") => setStatusFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedHub} onValueChange={setSelectedHub}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by hub" />
              </SelectTrigger>
              <SelectContent>
                {hubsQuery?.data?.map((hub: Hub) => (
                  <SelectItem key={hub._id} value={hub._id}>
                    {hub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4">
          {isApplicationsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <ApplicationCardSkeleton key={i} />
            ))
          ) : !hubApplicationsQuery || 'error' in hubApplicationsQuery ? (
            <Card>
              <CardContent className="text-center py-8">
                <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {hubApplicationsQuery?.error || "Failed to load applications"}
                </p>
              </CardContent>
            </Card>
          ) : 'page' in hubApplicationsQuery && hubApplicationsQuery.page.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hub applications found</p>
              </CardContent>
            </Card>
          ) : (
            hubApplicationsQuery.page?.map((application) => (
              <Card key={application._id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-medium">{application.user?.name}</h4>
                          <p className="text-sm text-muted-foreground">{application.user?.email}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          wants to join <strong>{application.hub?.name}</strong>
                        </div>
                        <Badge className={`border ${getStatusColor(application.status)}`}>
                          {application.status}
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Applied {new Date(application.submittedAt).toLocaleDateString()}
                        {application.reviewedAt && (
                          <span>
                            {" "}• Reviewed {new Date(application.reviewedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {application.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => {
                              setReviewingApplication(application as any);
                              setReviewForm({ status: "approved", notes: "" });
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => {
                              setReviewingApplication(application as any);
                              setReviewForm({ status: "rejected", notes: "" });
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Hub</DialogTitle>
            <DialogDescription>
              Create a new hub for organizing members around specific focus areas.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="form">Membership Form</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div>
                <Label htmlFor="name">Hub Name</Label>
                <Input
                  id="name"
                  value={hubForm.name}
                  onChange={(e) =>
                    setHubForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Water Quality Hub"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={hubForm.description}
                  onChange={(e) =>
                    setHubForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description of the hub..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="objectives">Objectives</Label>
                <Textarea
                  id="objectives"
                  value={hubForm.objectives}
                  onChange={(e) =>
                    setHubForm((prev) => ({
                      ...prev,
                      objectives: e.target.value,
                    }))
                  }
                  placeholder="Main objectives and goals of this hub..."
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="files" className="space-y-6">
              <FileUpload
                label="Hub Image"
                description="Upload an image to represent this hub"
                accept="image/*"
                maxSize={5}
                currentFiles={hubFiles.image}
                onFilesChange={(files) => setHubFiles(prev => ({ ...prev, image: files }))}
                onError={(error) => toast.error(error)}
              />

              <FileUpload
                label="Terms of Reference"
                description="Upload the terms of reference document for this hub"
                accept=".pdf,.doc,.docx"
                maxSize={10}
                currentFiles={hubFiles.termsOfReference}
                onFilesChange={(files) => setHubFiles(prev => ({ ...prev, termsOfReference: files }))}
                onError={(error) => toast.error(error)}
              />
            </TabsContent>

            <TabsContent value="form" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Membership Application Form</Label>
                  <p className="text-sm text-muted-foreground">
                    Configure the form fields that applicants will fill when applying to join this hub.
                  </p>
                </div>
                <Button onClick={addFormField} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </div>

              <div className="space-y-4">
                {hubForm.membershipFormFields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`field-label-${index}`}>Field Label</Label>
                        <Input
                          id={`field-label-${index}`}
                          value={field.label}
                          onChange={(e) => updateFormField(index, { label: e.target.value })}
                          placeholder="Enter field label"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`field-type-${index}`}>Field Type</Label>
                        <Select
                          value={field.type}
                          onValueChange={(value) => updateFormField(index, { type: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                            <SelectItem value="radio">Radio</SelectItem>
                            <SelectItem value="checkbox">Checkbox</SelectItem>
                            <SelectItem value="tel">Phone</SelectItem>
                            <SelectItem value="url">URL</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="file">File Upload</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`field-placeholder-${index}`}>Placeholder</Label>
                        <Input
                          id={`field-placeholder-${index}`}
                          value={field.placeholder || ""}
                          onChange={(e) => updateFormField(index, { placeholder: e.target.value })}
                          placeholder="Enter placeholder text"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`field-required-${index}`}
                            checked={field.required}
                            onChange={(e) => updateFormField(index, { required: e.target.checked })}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`field-required-${index}`} className="text-sm">
                            Required
                          </Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFormField(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div className="border rounded-lg p-6 bg-muted/30">
                <h3 className="text-lg font-semibold mb-4">Hub Preview</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Name</h4>
                    <p className="text-muted-foreground">{hubForm.name || "Hub name not set"}</p>
                  </div>

                  <div>
                    <h4 className="font-medium">Description</h4>
                    <p className="text-muted-foreground">{hubForm.description || "Description not set"}</p>
                  </div>

                  <div>
                    <h4 className="font-medium">Objectives</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{hubForm.objectives || "Objectives not set"}</p>
                  </div>

                  <div>
                    <h4 className="font-medium">Files</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>Image: {hubFiles.image.length > 0 ? hubFiles.image[0].name : "No image uploaded"}</p>
                      <p>Terms of Reference: {hubFiles.termsOfReference.length > 0 ? hubFiles.termsOfReference[0].name : "No document uploaded"}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium">Membership Form Fields ({hubForm.membershipFormFields.length})</h4>
                    <div className="space-y-2">
                      {hubForm.membershipFormFields.map((field) => (
                        <div key={field.id} className="text-sm border rounded p-2">
                          <span className="font-medium">{field.label}</span>
                          <span className="text-muted-foreground ml-2">({field.type})</span>
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleCreateHub} disabled={isLoading || !hubForm.name}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Hub"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Hub</DialogTitle>
            <DialogDescription>
              Update hub information and settings.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="form">Membership Form</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Hub Name</Label>
                <Input
                  id="edit-name"
                  value={hubForm.name}
                  onChange={(e) =>
                    setHubForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={hubForm.description}
                  onChange={(e) =>
                    setHubForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit-objectives">Objectives</Label>
                <Textarea
                  id="edit-objectives"
                  value={hubForm.objectives}
                  onChange={(e) =>
                    setHubForm((prev) => ({
                      ...prev,
                      objectives: e.target.value,
                    }))
                  }
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="files" className="space-y-6">
              <div>
                <FileUpload
                  label="Hub Image"
                  description="Upload an image to represent this hub"
                  accept="image/*"
                  maxSize={5}
                  currentFiles={hubFiles.image}
                  onFilesChange={(files) => setHubFiles(prev => ({ ...prev, image: files }))}
                  onError={(error) => toast.error(error)}
                />
                {editingHub?.image && hubFiles.image.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveHubImage(editingHub._id)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Remove Current Image
                  </Button>
                )}
              </div>

              <div>
                <FileUpload
                  label="Terms of Reference"
                  description="Upload the terms of reference document for this hub"
                  accept=".pdf,.doc,.docx"
                  maxSize={10}
                  currentFiles={hubFiles.termsOfReference}
                  onFilesChange={(files) => setHubFiles(prev => ({ ...prev, termsOfReference: files }))}
                  onError={(error) => toast.error(error)}
                />
                {editingHub?.termsOfReference && hubFiles.termsOfReference.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveHubTermsOfReference(editingHub._id)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Remove Current Terms of Reference
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="form" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Membership Application Form</Label>
                  <p className="text-sm text-muted-foreground">
                    Configure the form fields that applicants will fill when applying to join this hub.
                  </p>
                </div>
                <Button onClick={addFormField} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </div>

              <div className="space-y-4">
                {hubForm.membershipFormFields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`edit-field-label-${index}`}>Field Label</Label>
                        <Input
                          id={`edit-field-label-${index}`}
                          value={field.label}
                          onChange={(e) => updateFormField(index, { label: e.target.value })}
                          placeholder="Enter field label"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit-field-type-${index}`}>Field Type</Label>
                        <Select
                          value={field.type}
                          onValueChange={(value) => updateFormField(index, { type: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                            <SelectItem value="radio">Radio</SelectItem>
                            <SelectItem value="checkbox">Checkbox</SelectItem>
                            <SelectItem value="tel">Phone</SelectItem>
                            <SelectItem value="url">URL</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="file">File Upload</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`edit-field-placeholder-${index}`}>Placeholder</Label>
                        <Input
                          id={`edit-field-placeholder-${index}`}
                          value={field.placeholder || ""}
                          onChange={(e) => updateFormField(index, { placeholder: e.target.value })}
                          placeholder="Enter placeholder text"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`edit-field-required-${index}`}
                            checked={field.required}
                            onChange={(e) => updateFormField(index, { required: e.target.checked })}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`edit-field-required-${index}`} className="text-sm">
                            Required
                          </Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFormField(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div className="border rounded-lg p-6 bg-muted/30">
                <h3 className="text-lg font-semibold mb-4">Hub Preview</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Name</h4>
                    <p className="text-muted-foreground">{hubForm.name || "Hub name not set"}</p>
                  </div>

                  <div>
                    <h4 className="font-medium">Description</h4>
                    <p className="text-muted-foreground">{hubForm.description || "Description not set"}</p>
                  </div>

                  <div>
                    <h4 className="font-medium">Objectives</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{hubForm.objectives || "Objectives not set"}</p>
                  </div>

                  <div>
                    <h4 className="font-medium">Files</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>Image: {hubFiles.image.length > 0 ? hubFiles.image[0].name : "No image uploaded"}</p>
                      <p>Terms of Reference: {hubFiles.termsOfReference.length > 0 ? hubFiles.termsOfReference[0].name : "No document uploaded"}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium">Membership Form Fields ({hubForm.membershipFormFields.length})</h4>
                    <div className="space-y-2">
                      {hubForm.membershipFormFields.map((field) => (
                        <div key={field.id} className="text-sm border rounded p-2">
                          <span className="font-medium">{field.label}</span>
                          <span className="text-muted-foreground ml-2">({field.type})</span>
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleUpdateHub} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Hub"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
      <Dialog
        open={!!reviewingApplication}
        onOpenChange={() => setReviewingApplication(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
            <DialogDescription>
              Review {reviewingApplication?.user?.name}&#39;s application to
              join {reviewingApplication?.hub?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="review-status">Decision</Label>
              <Select
                value={reviewForm.status}
                onValueChange={(value: "approved" | "rejected") =>
                  setReviewForm((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approve</SelectItem>
                  <SelectItem value="rejected">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="review-notes">Notes (optional)</Label>
              <Textarea
                id="review-notes"
                value={reviewForm.notes}
                onChange={(e) =>
                  setReviewForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Add any notes or feedback..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewingApplication(null)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleReviewApplication} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `${reviewForm.status === "approved" ? "Approve" : "Reject"} Application`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}