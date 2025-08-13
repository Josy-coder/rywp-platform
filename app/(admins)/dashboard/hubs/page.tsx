"use client";

import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

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

export default function HubsPage() {
  const { user, currentToken } = useAuth();

  const hubsQuery = useQuery(api.hubs.getHubs, { activeOnly: false });
  const hubApplicationsQuery = useQuery(
    api.hubs.getHubApplications,
    currentToken
      ? {
          paginationOpts: { numItems: 20 },
          token: currentToken,
        }
      : "skip",
  );

  const createHub = useMutation(api.hubs.createHub);
  const updateHub = useMutation(api.hubs.updateHub);
  const reviewApplication = useMutation(api.hubs.reviewHubApplication);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedHub, setSelectedHub] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingHub, setEditingHub] = useState<Hub | null>(null);
  const [reviewingApplication, setReviewingApplication] =
    useState<HubApplication | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [hubForm, setHubForm] = useState({
    name: "",
    description: "",
    objectives: "",
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

  const isLoadingData =
    hubsQuery === undefined || hubApplicationsQuery === undefined;

  const filteredHubs =
    hubsQuery?.data?.filter((hub: Hub) => {
      return (
        hub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hub.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }) || [];

  const filteredApplications =
    hubApplicationsQuery?.data?.page?.filter((app: HubApplication) => {
      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;
      const matchesHub = selectedHub === "all" || app.hubId === selectedHub;
      const matchesSearch =
        !searchTerm ||
        app.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.hub?.name.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesHub && matchesSearch;
    }) || [];

  const handleCreateHub = async () => {
    if (!currentToken) return;

    setIsLoading(true);
    try {
      const result = await createHub({
        ...hubForm,
        membershipFormFields: [
          {
            id: "motivation",
            label: "Why do you want to join this hub?",
            type: "textarea",
            required: true,
            placeholder:
              "Tell us about your motivation and how you can contribute...",
          },
          {
            id: "experience",
            label: "Relevant Experience",
            type: "textarea",
            required: true,
            placeholder: "Describe your relevant experience in this field...",
          },
        ],
        token: currentToken,
      });

      if (result.success) {
        toast.success("Hub created successfully!");
        setShowCreateDialog(false);
        setHubForm({ name: "", description: "", objectives: "" });
      } else {
        toast.error(result.error || "Failed to create hub");
      }
    } catch (error) {
      console.error("Error creating hub:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateHub = async () => {
    if (!currentToken || !editingHub) return;

    setIsLoading(true);
    try {
      const result = await updateHub({
        hubId: editingHub._id as Id<"hubs">,
        ...hubForm,
        token: currentToken,
      });

      if (result.success) {
        toast.success("Hub updated successfully!");
        setEditingHub(null);
        setHubForm({ name: "", description: "", objectives: "" });
      } else {
        toast.error(result.error || "Failed to update hub");
      }
    } catch (error) {
      console.error("Error updating hub:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewApplication = async () => {
    if (!currentToken || !reviewingApplication) return;

    setIsLoading(true);
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
        toast.error(result.error || "Failed to review application");
      }
    } catch (error) {
      console.error("Error reviewing application:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoadingData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Hub
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Hub</DialogTitle>
              <DialogDescription>
                Create a new hub for organizing members around specific focus
                areas.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
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
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateHub}
                disabled={isLoading || !hubForm.name}
              >
                {isLoading ? "Creating..." : "Create Hub"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
                    <DialogContent>
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
                              });
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
                  <Badge variant={hub.isActive ? "default" : "secondary"}>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
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
                <SelectItem value="all">All Hubs</SelectItem>
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
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No hub applications found
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((application: HubApplication) => (
              <Card key={application._id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-medium">
                            {application.user?.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {application.user?.email}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          wants to join <strong>{application.hub?.name}</strong>
                        </div>
                        <Badge className={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Applied{" "}
                        {new Date(application.submittedAt).toLocaleDateString()}
                        {application.reviewedAt && (
                          <span>
                            {" "}
                            • Reviewed{" "}
                            {new Date(
                              application.reviewedAt,
                            ).toLocaleDateString()}
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
                            onClick={() => {
                              setReviewingApplication(application);
                              setReviewForm({ status: "approved", notes: "" });
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setReviewingApplication(application);
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

      <Dialog open={!!editingHub} onOpenChange={() => setEditingHub(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Hub</DialogTitle>
            <DialogDescription>
              Update hub information and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingHub(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateHub} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Hub"}
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
            >
              Cancel
            </Button>
            <Button onClick={handleReviewApplication} disabled={isLoading}>
              {isLoading
                ? "Processing..."
                : `${reviewForm.status === "approved" ? "Approve" : "Reject"} Application`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}