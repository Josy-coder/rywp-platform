"use client";

import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image"
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
  AlertCircle,
  Building2,
  Edit,
  ExternalLink,
  Globe,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import FileUpload from "@/components/ui/file-upload";

interface Partner {
  _id: string;
  name: string;
  website?: string;
  logoId?: Id<"_storage">; // Storage ID for file management
  logo?: string | null; // URL for display
  description?: string;
  isActive: boolean;
  createdAt: number;
  createdBy: string;
}

interface UploadedFile {
  _id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  storageId: string;
}

function PartnerCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function PartnershipsPage() {
  const { user, currentToken } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [viewingPartner, setViewingPartner] = useState<Partner | null>(null);
  const [deletingPartner, setDeletingPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const partnersQuery = useQuery(
    api.partners.getPartners,
    {
      activeOnly: false,
      search: debouncedSearchTerm,
      paginationOpts: { numItems: 50, cursor: null },
    }
  );

  const createPartner = useMutation(api.partners.createPartner);
  const updatePartner = useMutation(api.partners.updatePartner);
  const deletePartner = useMutation(api.partners.deletePartner);
  const uploadPartnerLogo = useMutation(api.partners.uploadPartnerLogo);
  const removePartnerLogo = useMutation(api.partners.removePartnerLogo);
  const togglePartnerStatus = useMutation(api.partners.togglePartnerStatus);

  const [partnerForm, setPartnerForm] = useState({
    name: "",
    website: "",
    description: "",
  });

  const [partnerLogo, setPartnerLogo] = useState<UploadedFile[]>([]);
  
  const filteredPartners = useMemo(() => {
    if (!partnersQuery?.page) return [];

    return partnersQuery.page.filter((partner: Partner) => {
      if (statusFilter === "active" && !partner.isActive) return false;
      return !(statusFilter === "inactive" && partner.isActive);

    });
  }, [partnersQuery, statusFilter]);

  if (!user) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please sign in to access partnerships management.
        </AlertDescription>
      </Alert>
    );
  }

  if (!user.isGlobalAdmin) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You need admin privileges to manage partnerships.
        </AlertDescription>
      </Alert>
    );
  }

  const isInitialLoading = partnersQuery === undefined;
  

  const resetForm = () => {
    setPartnerForm({
      name: "",
      website: "",
      description: "",
    });
    setPartnerLogo([]);
    setError(null);
  };

  const handleCreatePartner = async () => {
    if (!currentToken) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await createPartner({
        name: partnerForm.name,
        website: partnerForm.website || undefined,
        description: partnerForm.description || undefined,
        logo: partnerLogo[0]?.storageId as Id<"_storage"> | undefined,
        token: currentToken,
      });

      if (result.success) {
        toast.success(result.message || "Partner created successfully!");
        setShowCreateDialog(false);
        resetForm();
      } else {
        setError(result.error || "Failed to create partner");
      }
    } catch (error) {
      console.error("Error creating partner:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePartner = async () => {
    if (!currentToken || !editingPartner) return;

    setIsLoading(true);
    setError(null);
    try {

      if (partnerLogo.length > 0 && partnerLogo[0].storageId !== editingPartner.logo) {
        const logoResult = await uploadPartnerLogo({
          partnerId: editingPartner._id as Id<"partners">,
          logoId: partnerLogo[0].storageId as Id<"_storage">,
          token: currentToken,
        });
        if (!logoResult.success) {
          throw new Error(logoResult.error);
        }
      }

      const result = await updatePartner({
        partnerId: editingPartner._id as Id<"partners">,
        name: partnerForm.name,
        website: partnerForm.website || undefined,
        description: partnerForm.description || undefined,
        token: currentToken,
      });

      if (result.success) {
        toast.success(result.message || "Partner updated successfully!");
        setShowEditDialog(false);
        setEditingPartner(null);
        resetForm();
      } else {
        setError(result.error || "Failed to update partner");
      }
    } catch (error) {
      console.error("Error updating partner:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePartner = async () => {
    if (!currentToken || !deletingPartner) return;

    setIsLoading(true);
    try {
      const result = await deletePartner({
        partnerId: deletingPartner._id as Id<"partners">,
        token: currentToken,
      });

      if (result.success) {
        toast.success(result.message || "Partner deleted successfully!");
        setShowDeleteDialog(false);
        setDeletingPartner(null);
      } else {
        setError(result.error || "Failed to delete partner");
      }
    } catch (error) {
      console.error("Error deleting partner:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (partner: Partner) => {
    if (!currentToken) return;

    try {
      const result = await togglePartnerStatus({
        partnerId: partner._id as Id<"partners">,
        token: currentToken,
      });

      if (result.success) {
        toast.success(result.message || "Partner status updated successfully!");
      } else {
        toast.error(result.error || "Failed to update partner status");
      }
    } catch (error) {
      console.error("Error toggling partner status:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleRemoveLogo = async (partnerId: string) => {
    if (!currentToken) return;

    try {
      const result = await removePartnerLogo({
        partnerId: partnerId as Id<"partners">,
        token: currentToken,
      });

      if (result.success) {
        toast.success("Partner logo removed successfully!");
        setPartnerLogo([]);
      } else {
        toast.error(result.error || "Failed to remove partner logo");
      }
    } catch (error) {
      console.error("Error removing partner logo:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-600 text-white"
      : "bg-red-100 text-red-800 border-red-200";
  };

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
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PartnerCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partnerships</h1>
          <p className="text-gray-600">
            Manage organizational partnerships and collaborators
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Partner
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
          <h2 className="text-xl font-semibold">
            Partners ({filteredPartners.length})
          </h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: "all" | "active" | "inactive") => setStatusFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {!partnersQuery ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PartnerCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredPartners.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "No partners found matching your search" : "No partners found"}
              </p>
              {!searchTerm && (
                <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Partner
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPartners.map((partner: Partner) => (
              <Card key={partner._id} className="transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {partner.logo ? (
                          <Image
                            src={partner.logo}
                            alt={`${partner.name} logo`}
                            width={48}
                            height={48}
                            className="object-contain rounded-lg border bg-white"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg truncate">{partner.name}</CardTitle>
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
                          </a>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setViewingPartner(partner);
                            setShowViewDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingPartner(partner);
                            setPartnerForm({
                              name: partner.name,
                              website: partner.website || "",
                              description: partner.description || "",
                            });
                            // Populate current logo for editing
                            setPartnerLogo(
                              partner.logo && partner.logoId
                                ? [
                                  {
                                    _id: partner.logoId,
                                    name: "Current Logo",
                                    size: 0,
                                    type: "image/*",
                                    storageId: partner.logoId,
                                    url: partner.logo,
                                  },
                                ]
                                : []
                            );
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(partner)}
                          className={partner.isActive ? "text-orange-600" : "text-green-600"}
                        >
                          {partner.isActive ? (
                            <>
                              <ToggleLeft className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <ToggleRight className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setDeletingPartner(partner);
                            setShowDeleteDialog(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {partner.description && (
                    <CardDescription className="mb-4 line-clamp-2">
                      {partner.description}
                    </CardDescription>
                  )}
                  <div className="flex items-center justify-between">
                    <Badge className={`border ${getStatusColor(partner.isActive)}`}>
                      {partner.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Added {new Date(partner.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Partner</DialogTitle>
            <DialogDescription>
              Add a new partnership organization to collaborate with.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="partner-name">Organization Name *</Label>
                <Input
                  id="partner-name"
                  value={partnerForm.name}
                  onChange={(e) =>
                    setPartnerForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter organization name"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="partner-website">Website</Label>
                <Input
                  id="partner-website"
                  type="url"
                  value={partnerForm.website}
                  onChange={(e) =>
                    setPartnerForm((prev) => ({ ...prev, website: e.target.value }))
                  }
                  placeholder="https://example.com"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="partner-description">Description</Label>
                <Textarea
                  id="partner-description"
                  value={partnerForm.description}
                  onChange={(e) =>
                    setPartnerForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Brief description of the partnership..."
                  rows={3}
                />
              </div>
            </div>

            <FileUpload
              label="Partner Logo"
              description="Upload a logo for this partner (optional)"
              accept="image/*"
              maxSize={5}
              currentFiles={partnerLogo}
              onFilesChange={setPartnerLogo}
              onError={(error) => setError(error)}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePartner}
              disabled={isLoading || !partnerForm.name.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Add Partner"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Partner</DialogTitle>
            <DialogDescription>
              Update partner information and settings.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="edit-partner-name">Organization Name *</Label>
                <Input
                  id="edit-partner-name"
                  value={partnerForm.name}
                  onChange={(e) =>
                    setPartnerForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter organization name"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-partner-website">Website</Label>
                <Input
                  id="edit-partner-website"
                  type="url"
                  value={partnerForm.website}
                  onChange={(e) =>
                    setPartnerForm((prev) => ({ ...prev, website: e.target.value }))
                  }
                  placeholder="https://example.com"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-partner-description">Description</Label>
                <Textarea
                  id="edit-partner-description"
                  value={partnerForm.description}
                  onChange={(e) =>
                    setPartnerForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Brief description of the partnership..."
                  rows={3}
                />
              </div>
            </div>

            <div>
              <FileUpload
                label="Partner Logo"
                description="Upload a logo for this partner"
                accept="image/*"
                maxSize={5}
                currentFiles={partnerLogo}
                onFilesChange={setPartnerLogo}
                onError={(error) => setError(error)}
              />
              {editingPartner?.logo && partnerLogo.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveLogo(editingPartner._id)}
                  className="text-red-600 border-red-600 hover:bg-red-50 mt-2"
                >
                  Remove Current Logo
                </Button>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setEditingPartner(null);
                resetForm();
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdatePartner}
              disabled={isLoading || !partnerForm.name.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Partner"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Partner Details</DialogTitle>
            <DialogDescription>
              View detailed information about {viewingPartner?.name}
            </DialogDescription>
          </DialogHeader>

          {viewingPartner && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                {viewingPartner.logo ? (
                  <Image
                    src={viewingPartner.logo}
                    alt={`${viewingPartner.name} logo`}
                    width={64}
                    height={64}
                    className="object-contain rounded-lg border bg-white"
                  />
                ) : (
                  <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{viewingPartner.name}</h3>
                  <Badge className={`border ${getStatusColor(viewingPartner.isActive)}`}>
                    {viewingPartner.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Website</Label>
                  {viewingPartner.website ? (
                    <div className="flex items-center mt-1">
                      <a
                        href={viewingPartner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        {viewingPartner.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">Not provided</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium">Added</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(viewingPartner.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {viewingPartner.description && (
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                    {viewingPartner.description}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (viewingPartner) {
                  setEditingPartner(viewingPartner);
                  setPartnerForm({
                    name: viewingPartner.name,
                    website: viewingPartner.website || "",
                    description: viewingPartner.description || "",
                  });
                  setPartnerLogo(
                    viewingPartner.logo
                      ? [
                        {
                          _id: viewingPartner.logo,
                          name: "Current Logo",
                          size: 0,
                          type: "image/*",
                          storageId: viewingPartner.logo,
                        },
                      ]
                      : []
                  );
                  setShowViewDialog(false);
                  setShowEditDialog(true);
                }
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Partner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Partner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deletingPartner?.name}</span>? This
              action cannot be undone and will remove the partner from all associated
              projects.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false);
                setDeletingPartner(null);
                setError(null);
              }}
              disabled={isLoading}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePartner}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Partner"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}