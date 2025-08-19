"use client";

import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  User,
  FileText,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import FileUpload from "@/components/ui/file-upload";

interface Publication {
  _id: Id<"publications">;
  _creationTime: number;
  title: string;
  content: string;
  type: "policy_brief" | "article" | "blog_post" | "press_release" | "technical_report";
  authorId: Id<"users">;
  status: "draft" | "pending" | "published";
  publishedAt?: number;
  featuredImageId?: Id<"_storage">; // Storage ID for file management
  featuredImage?: string | null;
  attachmentIds: Id<"_storage">[]; // Storage IDs for file management
  attachments: (string | null)[];
  tags: string[];
  isRestrictedAccess: boolean;
  createdAt: number;
  approvedBy?: Id<"users">;
  author?: {
    _id: Id<"users">;
    name: string;
    email: string;
    profileImageId?: Id<"_storage">; // Storage ID for file management
    profileImage?: string | null; // URL for display
  } | null;
  approver?: {
    _id: Id<"users">;
    name: string;
    email: string;
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

function PublicationCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[16/10]">
        <Skeleton className="h-full w-full" />
      </div>
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

function PublicationsPageContent() {
  const { user, currentToken } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const editParam = searchParams.get('edit');
  const typeParam = searchParams.get('type');
  const statusParam = searchParams.get('status');

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [deletingPublication, setDeletingPublication] = useState<Publication | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const publicationsQuery = useQuery(api.publications.getPublications, {});
  const createPublication = useMutation(api.publications.createPublication);
  const updatePublication = useMutation(api.publications.updatePublication);
  const deletePublication = useMutation(api.publications.deletePublication);

  useEffect(() => {
    if (typeParam && typeParam !== "all") {
      setTypeFilter(typeParam);
    }
    if (statusParam && statusParam !== "all") {
      setStatusFilter(statusParam);
    }
  }, [typeParam, statusParam]);

  useEffect(() => {
    if (!publicationsQuery?.data || !editParam || !user) return;

    const publicationToEdit = publicationsQuery.data.find((p: Publication) => p._id === editParam);
    if (publicationToEdit) {

      const canEdit = publicationToEdit.authorId === user.id || user.isGlobalAdmin;

      if (canEdit) {
        setEditingPublication(publicationToEdit);
        setPublicationForm({
          title: publicationToEdit.title,
          content: publicationToEdit.content,
          type: publicationToEdit.type,
          tags: publicationToEdit.tags,
          isRestrictedAccess: publicationToEdit.isRestrictedAccess,
        });


        // Populate current files for editing
        setFeaturedImage(
          publicationToEdit.featuredImage && publicationToEdit.featuredImageId
            ? [
              {
                _id: publicationToEdit.featuredImageId,
                name: "Current Image",
                size: 0,
                type: "image/*",
                storageId: publicationToEdit.featuredImageId,
                url: publicationToEdit.featuredImage,
              },
            ]
            : []
        );
        
        // Set up attachments using both IDs and URLs
        const currentAttachments = publicationToEdit.attachmentIds.map((id, index) => ({
          _id: id,
          name: `Attachment ${index + 1}`,
          size: 0,
          type: "application/pdf",
          storageId: id,
          url: publicationToEdit.attachments[index] || undefined,
        }));
        setAttachments(currentAttachments);
        setShowEditDialog(true);

        const newParams = new URLSearchParams(searchParams);
        newParams.delete('edit');
        const newUrl = newParams.toString() ? `?${newParams.toString()}` : '/dashboard/publications';
        router.replace(newUrl, { scroll: false });
      }
    }
  }, [publicationsQuery?.data, editParam, user, searchParams, router]);

  const updateURLParams = (newTypeFilter?: string, newStatusFilter?: string) => {
    const params = new URLSearchParams();

    const type = newTypeFilter ?? typeFilter;
    const status = newStatusFilter ?? statusFilter;

    if (type && type !== "all") params.set('type', type);
    if (status && status !== "all") params.set('status', status);

    const newUrl = params.toString() ? `?${params.toString()}` : '/dashboard/publications';
    router.replace(newUrl, { scroll: false });
  };

  const [publicationForm, setPublicationForm] = useState({
    title: "",
    content: "",
    type: "article" as Publication["type"],
    tags: [] as string[],
    isRestrictedAccess: false,
  });

  const [featuredImage, setFeaturedImage] = useState<UploadedFile[]>([]);
  const [attachments, setAttachments] = useState<UploadedFile[]>([]);
  const [newTag, setNewTag] = useState("");

  const isInitialLoading = publicationsQuery === undefined;

  const filteredPublications = useMemo(() => {
    if (!publicationsQuery?.data) return [];

    return publicationsQuery.data.filter((publication: Publication) => {

      if (debouncedSearchTerm) {
        const searchLower = debouncedSearchTerm.toLowerCase();
        const matchesSearch =
          publication.title.toLowerCase().includes(searchLower) ||
          publication.content.toLowerCase().includes(searchLower) ||
          publication.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          (publication.author?.name?.toLowerCase().includes(searchLower) || false);

        if (!matchesSearch) return false;
      }

      if (typeFilter !== "all" && publication.type !== typeFilter) return false;

      return !(statusFilter !== "all" && publication.status !== statusFilter);


    });
  }, [publicationsQuery, debouncedSearchTerm, typeFilter, statusFilter]);

  const resetForm = () => {
    setPublicationForm({
      title: "",
      content: "",
      type: "article",
      tags: [],
      isRestrictedAccess: false,
    });
    setFeaturedImage([]);
    setAttachments([]);
    setNewTag("");
    setError(null);
  };

  const addTag = () => {
    if (newTag.trim() && !publicationForm.tags.includes(newTag.trim())) {
      setPublicationForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPublicationForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleCreatePublication = async () => {
    if (!currentToken) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await createPublication({
        title: publicationForm.title,
        content: publicationForm.content,
        type: publicationForm.type,
        featuredImage: featuredImage[0]?.storageId as Id<"_storage"> | undefined,
        attachments: attachments.map(file => file.storageId as Id<"_storage">),
        tags: publicationForm.tags,
        isRestrictedAccess: publicationForm.isRestrictedAccess,
        token: currentToken,
      });

      if (result.success) {
        toast.success("Publication created successfully!");
        setShowCreateDialog(false);
        resetForm();
      } else {
        setError(result.error || "Failed to create publication");
      }
    } catch (error) {
      console.error("Error creating publication:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePublication = async () => {
    if (!currentToken || !editingPublication) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await updatePublication({
        publicationId: editingPublication._id,
        title: publicationForm.title,
        content: publicationForm.content,
        type: publicationForm.type,
        featuredImage: featuredImage[0]?.storageId as Id<"_storage"> | undefined,
        attachments: attachments.map(file => file.storageId as Id<"_storage">),
        tags: publicationForm.tags,
        isRestrictedAccess: publicationForm.isRestrictedAccess,
        token: currentToken,
      });

      if (result.success) {
        toast.success("Publication updated successfully!");
        setShowEditDialog(false);
        setEditingPublication(null);
        resetForm();
      } else {
        setError(result.error || "Failed to update publication");
      }
    } catch (error) {
      console.error("Error updating publication:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePublication = async () => {
    if (!currentToken || !deletingPublication) return;

    setIsLoading(true);
    try {
      const result = await deletePublication({
        publicationId: deletingPublication._id,
        token: currentToken,
      });

      if (result.success) {
        toast.success("Publication deleted successfully!");
        setShowDeleteDialog(false);
        setDeletingPublication(null);
      } else {
        setError(result.error || "Failed to delete publication");
      }
    } catch (error) {
      console.error("Error deleting publication:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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
        return <CheckCircle className="h-3 w-3" />;
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "draft":
        return <Edit className="h-3 w-3" />;
      default:
        return <XCircle className="h-3 w-3" />;
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

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    updateURLParams(value, undefined);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    updateURLParams(undefined, value);
  };

  if (!user) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please sign in to access publications management.
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
            <PublicationCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Publications</h1>
          <p className="text-gray-600">
            Manage and publish content and resources
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Publication
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
            All Publications ({filteredPublications.length})
          </h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="blog_post">Blog Post</SelectItem>
                <SelectItem value="policy_brief">Policy Brief</SelectItem>
                <SelectItem value="press_release">Press Release</SelectItem>
                <SelectItem value="technical_report">Technical Report</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredPublications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                  ? "No publications found matching your criteria"
                  : "No publications found"}
              </p>
              <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Publication
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPublications.map((publication: Publication) => (
              <Card key={publication._id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="aspect-[16/10] relative">
                  {publication.featuredImage ? (
                    <Image
                      src={publication.featuredImage}
                      alt={publication.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  {publication.isRestrictedAccess && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="destructive" className="text-xs">
                        Restricted
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg line-clamp-2 mb-2">{publication.title}</CardTitle>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(publication.type)}
                        </Badge>
                        <Badge className={`text-xs border ${getStatusColor(publication.status)}`}>
                          {getStatusIcon(publication.status)}
                          <span className="ml-1">{publication.status}</span>
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/publications/${publication._id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {(publication.authorId === user.id || user.isGlobalAdmin) && (
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingPublication(publication);
                              setPublicationForm({
                                title: publication.title,
                                content: publication.content,
                                type: publication.type,
                                tags: publication.tags,
                                isRestrictedAccess: publication.isRestrictedAccess,
                              });


                              // Populate current files for editing
                              setFeaturedImage(
                                publication.featuredImage && publication.featuredImageId
                                  ? [
                                    {
                                      _id: publication.featuredImageId,
                                      name: "Current Image",
                                      size: 0,
                                      type: "image/*",
                                      storageId: publication.featuredImageId,
                                      url: publication.featuredImage,
                                    },
                                  ]
                                  : []
                              );
                              
                              // Set up attachments using both IDs and URLs
                              const currentAttachments = publication.attachmentIds.map((id, index) => ({
                                _id: id,
                                name: `Attachment ${index + 1}`,
                                size: 0,
                                type: "application/pdf",
                                storageId: id,
                                url: publication.attachments[index] || undefined,
                              }));
                              setAttachments(currentAttachments);
                              setShowEditDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {publication.attachments.length > 0 && (
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download Files
                          </DropdownMenuItem>
                        )}
                        {(publication.authorId === user.id || user.isGlobalAdmin) && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setDeletingPublication(publication);
                                setShowDeleteDialog(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="line-clamp-3 mb-4">
                    {publication.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                  </CardDescription>

                  <div className="space-y-3">
                    {publication.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {publication.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {publication.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{publication.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <span>{publication.author?.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>
                          {publication.status === "published" && publication.publishedAt
                            ? new Date(publication.publishedAt).toLocaleDateString()
                            : new Date(publication.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {publication.attachments.length > 0 && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <FileText className="h-3 w-3 mr-1" />
                        <span>{publication.attachments.length} attachment{publication.attachments.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t">
                    <Link href={`/dashboard/publications/${publication._id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Publication
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Publication</DialogTitle>
            <DialogDescription>
              Add a new publication to share knowledge and insights.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="media">Media & Files</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={publicationForm.title}
                    onChange={(e) =>
                      setPublicationForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Enter publication title"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={publicationForm.content}
                    onChange={(e) =>
                      setPublicationForm((prev) => ({ ...prev, content: e.target.value }))
                    }
                    placeholder="Write your publication content..."
                    rows={12}
                    className="min-h-[300px]"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={publicationForm.type}
                    onValueChange={(value: Publication["type"]) =>
                      setPublicationForm((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="blog_post">Blog Post</SelectItem>
                      <SelectItem value="policy_brief">Policy Brief</SelectItem>
                      <SelectItem value="press_release">Press Release</SelectItem>
                      <SelectItem value="technical_report">Technical Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <FileUpload
                label="Featured Image"
                description="Upload an image to represent this publication"
                accept="image/*"
                maxSize={10}
                currentFiles={featuredImage}
                onFilesChange={setFeaturedImage}
                onError={(error) => setError(error)}
              />

              <FileUpload
                label="Attachments"
                description="Upload supporting documents and files"
                accept="*/*"
                multiple={true}
                maxFiles={10}
                maxSize={50}
                currentFiles={attachments}
                onFilesChange={setAttachments}
                onError={(error) => setError(error)}
              />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div>
                <Label>Tags</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    Add
                  </Button>
                </div>
                {publicationForm.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {publicationForm.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="restricted"
                  checked={publicationForm.isRestrictedAccess}
                  onChange={(e) =>
                    setPublicationForm((prev) => ({ ...prev, isRestrictedAccess: e.target.checked }))
                  }
                  className="rounded border-gray-300"
                />
                <Label htmlFor="restricted">Restricted Access</Label>
                <p className="text-xs text-muted-foreground">
                  Requires approval to access
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleCreatePublication}
              disabled={
                isLoading ||
                !publicationForm.title ||
                !publicationForm.content
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Publication"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Publication</DialogTitle>
            <DialogDescription>
              Update publication information and content.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="media">Media & Files</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="edit-title">Title *</Label>
                  <Input
                    id="edit-title"
                    value={publicationForm.title}
                    onChange={(e) =>
                      setPublicationForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Enter publication title"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-content">Content *</Label>
                  <Textarea
                    id="edit-content"
                    value={publicationForm.content}
                    onChange={(e) =>
                      setPublicationForm((prev) => ({ ...prev, content: e.target.value }))
                    }
                    placeholder="Write your publication content..."
                    rows={12}
                    className="min-h-[300px]"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-type">Type *</Label>
                  <Select
                    value={publicationForm.type}
                    onValueChange={(value: Publication["type"]) =>
                      setPublicationForm((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="blog_post">Blog Post</SelectItem>
                      <SelectItem value="policy_brief">Policy Brief</SelectItem>
                      <SelectItem value="press_release">Press Release</SelectItem>
                      <SelectItem value="technical_report">Technical Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <FileUpload
                label="Featured Image"
                description="Upload an image to represent this publication"
                accept="image/*"
                maxSize={10}
                currentFiles={featuredImage}
                onFilesChange={setFeaturedImage}
                onError={(error) => setError(error)}
              />

              <FileUpload
                label="Attachments"
                description="Upload supporting documents and files"
                accept="*/*"
                multiple={true}
                maxFiles={10}
                maxSize={50}
                currentFiles={attachments}
                onFilesChange={setAttachments}
                onError={(error) => setError(error)}
              />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div>
                <Label>Tags</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    Add
                  </Button>
                </div>
                {publicationForm.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {publicationForm.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-restricted"
                  checked={publicationForm.isRestrictedAccess}
                  onChange={(e) =>
                    setPublicationForm((prev) => ({ ...prev, isRestrictedAccess: e.target.checked }))
                  }
                  className="rounded border-gray-300"
                />
                <Label htmlFor="edit-restricted">Restricted Access</Label>
                <p className="text-xs text-muted-foreground">
                  Requires approval to access
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setEditingPublication(null);
                resetForm();
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdatePublication}
              disabled={
                isLoading ||
                !publicationForm.title ||
                !publicationForm.content
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Publication"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Publication</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deletingPublication?.title}</span>? This
              action cannot be undone and will remove the publication and all its files permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false);
                setDeletingPublication(null);
                setError(null);
              }}
              disabled={isLoading}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePublication}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Publication"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function PublicationsPage() {
  return (
    <Suspense fallback={<PublicationCardSkeleton />}>
      <PublicationsPageContent />
    </Suspense>
  );
}