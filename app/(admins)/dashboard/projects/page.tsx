"use client";

import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useMemo, useEffect, Suspense} from "react";
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
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  Trash2,
  Users,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import FileUpload from "@/components/ui/file-upload";

interface Project {
  _id: Id<"projects">;
  _creationTime: number;
  title: string;
  description: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  status: "ongoing" | "completed";
  theme: string;
  hubId: Id<"hubs">;
  partnerIds: Id<"partners">[];
  featuredImage?: Id<"_storage">;
  startDate: number;
  endDate?: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: number;
  createdBy: Id<"users">;

  hub?: {
    _id: Id<"hubs">;
    _creationTime: number;
    name: string;
    description: string;
    objectives: string;
    termsOfReference?: Id<"_storage">;
    membershipFormFields: any[];
    image?: Id<"_storage">;
    isActive: boolean;
    createdAt: number;
    createdBy: Id<"users">;
  } | null;
  partners?: Array<{
    _id: Id<"partners">;
    _creationTime: number;
    name: string;
    website?: string;
    logo?: Id<"_storage">;
    description?: string;
    isActive: boolean;
    createdAt: number;
    createdBy: Id<"users">;
  } | null>;
}

interface Hub {
  _id: Id<"hubs">;
  name: string;
  isActive: boolean;
}

interface Partner {
  _id: Id<"partners">;
  name: string;
  logo?: Id<"_storage">;
  isActive: boolean;
}

interface UploadedFile {
  _id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  storageId: string;
}

function ProjectCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video">
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

const ProjectsPageContent = () => {
  const { user, currentToken } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const editParam = searchParams.get('edit');
  const hubParam = searchParams.get('hub');
  const statusParam = searchParams.get('status');
  const themeParam = searchParams.get('theme');

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "ongoing" | "completed">("all");
  const [hubFilter, setHubFilter] = useState<string>("all");
  const [themeFilter, setThemeFilter] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const projectsQuery = useQuery(api.projects.getProjects, {});
  const hubsQuery = useQuery(api.hubs.getHubs, { activeOnly: true });
  const partnersQuery = useQuery(api.partners.getPartners, { activeOnly: true });

  const createProject = useMutation(api.projects.createProject);
  const updateProject = useMutation(api.projects.updateProject);
  const deleteProject = useMutation(api.projects.deleteProject);

  useEffect(() => {

    if (hubParam && hubParam !== "all") {
      setHubFilter(hubParam);
    }
    if (statusParam && (statusParam === "ongoing" || statusParam === "completed")) {
      setStatusFilter(statusParam);
    }
    if (themeParam && themeParam !== "all") {
      setThemeFilter(themeParam);
    }
  }, [hubParam, statusParam, themeParam]);

  useEffect(() => {
    if (!projectsQuery?.data || !editParam || !user?.isGlobalAdmin) return;

    const projectToEdit = projectsQuery.data.find((p: Project) => p._id === editParam);
    if (projectToEdit) {
      setEditingProject(projectToEdit);
      setProjectForm({
        title: projectToEdit.title,
        description: projectToEdit.description,
        location: projectToEdit.location,
        status: projectToEdit.status,
        theme: projectToEdit.theme,
        hubId: projectToEdit.hubId,
        partnerIds: projectToEdit.partnerIds,
        startDate: new Date(projectToEdit.startDate).toISOString().split('T')[0],
        endDate: projectToEdit.endDate ? new Date(projectToEdit.endDate).toISOString().split('T')[0] : "",
        isFeatured: projectToEdit.isFeatured,
        coordinates: projectToEdit.coordinates || { lat: 0, lng: 0 },
      });
      setProjectImage(
        projectToEdit.featuredImage
          ? [
            {
              _id: projectToEdit.featuredImage,
              name: "Current Image",
              size: 0,
              type: "image/*",
              storageId: projectToEdit.featuredImage,
            },
          ]
          : []
      );
      setShowEditDialog(true);

      const newParams = new URLSearchParams(searchParams);
      newParams.delete('edit');
      const newUrl = newParams.toString() ? `?${newParams.toString()}` : '/dashboard/projects';
      router.replace(newUrl, { scroll: false });
    }
  }, [projectsQuery?.data, editParam, user?.isGlobalAdmin, searchParams, router]);

  const updateURLParams = (newHubFilter?: string, newStatusFilter?: string, newThemeFilter?: string) => {
    const params = new URLSearchParams();

    const hub = newHubFilter ?? hubFilter;
    const status = newStatusFilter ?? statusFilter;
    const theme = newThemeFilter ?? themeFilter;

    if (hub && hub !== "all") params.set('hub', hub);
    if (status && status !== "all") params.set('status', status);
    if (theme && theme !== "all") params.set('theme', theme);

    const newUrl = params.toString() ? `?${params.toString()}` : '/dashboard/projects';
    router.replace(newUrl, { scroll: false });
  };

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    location: "",
    status: "ongoing" as "ongoing" | "completed",
    theme: "",
    hubId: "",
    partnerIds: [] as string[],
    startDate: "",
    endDate: "",
    isFeatured: false,
    coordinates: {
      lat: 0,
      lng: 0,
    },
  });

  const [projectImage, setProjectImage] = useState<UploadedFile[]>([]);

  const isInitialLoading = projectsQuery === undefined || hubsQuery === undefined || partnersQuery === undefined;

  const filteredProjects = useMemo(() => {
    if (!projectsQuery?.data) return [];

    return projectsQuery.data.filter((project: Project) => {

      if (debouncedSearchTerm) {
        const searchLower = debouncedSearchTerm.toLowerCase();
        const matchesSearch =
          project.title.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.location.toLowerCase().includes(searchLower) ||
          project.theme.toLowerCase().includes(searchLower) ||
          (project.hub?.name?.toLowerCase().includes(searchLower) || false);

        if (!matchesSearch) return false;
      }

      if (statusFilter !== "all" && project.status !== statusFilter) return false;

      if (hubFilter !== "all" && project.hub?._id !== hubFilter) return false;

      return !(themeFilter !== "all" && project.theme !== themeFilter);
    });
  }, [projectsQuery, debouncedSearchTerm, statusFilter, hubFilter, themeFilter]);

  const uniqueThemes = useMemo(() => {
    if (!projectsQuery?.data) return [];

    return [
      ...new Set(
        projectsQuery.data
          .filter((p: Project) => p.theme != null)
          .map((p: Project) => p.theme)
      ),
    ];
  }, [projectsQuery]);

  const resetForm = () => {
    setProjectForm({
      title: "",
      description: "",
      location: "",
      status: "ongoing",
      theme: "",
      hubId: "",
      partnerIds: [],
      startDate: "",
      endDate: "",
      isFeatured: false,
      coordinates: { lat: 0, lng: 0 },
    });
    setProjectImage([]);
    setError(null);
  };

  const handleCreateProject = async () => {
    if (!currentToken) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await createProject({
        title: projectForm.title,
        description: projectForm.description,
        location: projectForm.location,
        status: projectForm.status,
        theme: projectForm.theme,
        hubId: projectForm.hubId as Id<"hubs">,
        partnerIds: projectForm.partnerIds as Id<"partners">[],
        startDate: new Date(projectForm.startDate).getTime(),
        endDate: projectForm.endDate ? new Date(projectForm.endDate).getTime() : undefined,
        isFeatured: projectForm.isFeatured,
        coordinates: projectForm.coordinates.lat !== 0 && projectForm.coordinates.lng !== 0
          ? projectForm.coordinates
          : undefined,
        featuredImage: projectImage[0]?.storageId as Id<"_storage"> | undefined,
        token: currentToken,
      });

      if (result.success) {
        toast.success("Project created successfully!");
        setShowCreateDialog(false);
        resetForm();
      } else {
        setError(result.error || "Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProject = async () => {
    if (!currentToken || !editingProject) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await updateProject({
        projectId: editingProject._id as Id<"projects">,
        title: projectForm.title,
        description: projectForm.description,
        location: projectForm.location,
        status: projectForm.status,
        theme: projectForm.theme,
        partnerIds: projectForm.partnerIds as Id<"partners">[],
        startDate: new Date(projectForm.startDate).getTime(),
        endDate: projectForm.endDate ? new Date(projectForm.endDate).getTime() : undefined,
        isFeatured: projectForm.isFeatured,
        coordinates: projectForm.coordinates.lat !== 0 && projectForm.coordinates.lng !== 0
          ? projectForm.coordinates
          : undefined,
        featuredImage: projectImage[0]?.storageId as Id<"_storage"> | undefined,
        token: currentToken,
      });

      if (result.success) {
        toast.success("Project updated successfully!");
        setShowEditDialog(false);
        setEditingProject(null);
        resetForm();
      } else {
        setError(result.error || "Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!currentToken || !deletingProject) return;

    setIsLoading(true);
    try {
      const result = await deleteProject({
        projectId: deletingProject._id as Id<"projects">,
        token: currentToken,
      });

      if (result.success) {
        toast.success("Project deleted successfully!");
        setShowDeleteDialog(false);
        setDeletingProject(null);
      } else {
        setError(result.error || "Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleStatusFilterChange = (value: "all" | "ongoing" | "completed") => {
    setStatusFilter(value);
    updateURLParams(undefined, value, undefined);
  };

  const handleHubFilterChange = (value: string) => {
    setHubFilter(value);
    updateURLParams(value, undefined, undefined);
  };

  const handleThemeFilterChange = (value: string) => {
    setThemeFilter(value);
    updateURLParams(undefined, undefined, value);
  };

  if (!user) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please sign in to access projects management.
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
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">
            Manage and track RYWP projects and initiatives
          </p>
        </div>
        {user.isGlobalAdmin && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
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
            All Projects ({filteredProjects.length})
          </h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={hubFilter} onValueChange={handleHubFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Hubs" />
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
            <Select value={themeFilter} onValueChange={handleThemeFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Themes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Themes</SelectItem>
                {uniqueThemes.map((theme) => (
                  <SelectItem key={theme} value={theme}>
                    {theme}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || hubFilter !== "all" || themeFilter !== "all"
                  ? "No projects found matching your criteria"
                  : "No projects found"}
              </p>
              {!searchTerm && user.isGlobalAdmin && (
                <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Project
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project: Project) => (
              <Card key={project._id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="aspect-video relative">
                  {project.featuredImage ? (
                    <img
                      src={project.featuredImage}
                      alt={project.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  {project.isFeatured && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {project.hub?.name}
                        </Badge>
                        <Badge className={`text-xs border ${getStatusColor(project.status)}`}>
                          {project.status}
                        </Badge>
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
                            <Link href={`/dashboard/projects/${project._id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingProject(project);
                              setProjectForm({
                                title: project.title,
                                description: project.description,
                                location: project.location,
                                status: project.status,
                                theme: project.theme,
                                hubId: project.hubId,
                                partnerIds: project.partnerIds,
                                startDate: new Date(project.startDate).toISOString().split('T')[0],
                                endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : "",
                                isFeatured: project.isFeatured,
                                coordinates: project.coordinates || { lat: 0, lng: 0 },
                              });
                              setProjectImage(
                                project.featuredImage
                                  ? [
                                    {
                                      _id: project.featuredImage,
                                      name: "Current Image",
                                      size: 0,
                                      type: "image/*",
                                      storageId: project.featuredImage,
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
                            onClick={() => {
                              setDeletingProject(project);
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
                    {project.description}
                  </CardDescription>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="truncate">{project.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span>
                        {new Date(project.startDate).toLocaleDateString()}
                        {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString()}`}
                      </span>
                    </div>
                    {project.partners && project.partners.length > 0 && (
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span className="truncate">
                          {project.partners.filter(Boolean).length} partner{project.partners.filter(Boolean).length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <Link href={`/dashboard/projects/${project._id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Project
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
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project to track and showcase your work.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={projectForm.title}
                    onChange={(e) =>
                      setProjectForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Enter project title"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={projectForm.description}
                    onChange={(e) =>
                      setProjectForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Describe the project..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="hub">Hub *</Label>
                  <Select
                    value={projectForm.hubId}
                    onValueChange={(value) =>
                      setProjectForm((prev) => ({ ...prev, hubId: value }))
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hub" />
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
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={projectForm.status}
                    onValueChange={(value: "ongoing" | "completed") =>
                      setProjectForm((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="theme">Theme *</Label>
                  <Input
                    id="theme"
                    value={projectForm.theme}
                    onChange={(e) =>
                      setProjectForm((prev) => ({ ...prev, theme: e.target.value }))
                    }
                    placeholder="e.g., Water Quality, Sanitation"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={projectForm.location}
                    onChange={(e) =>
                      setProjectForm((prev) => ({ ...prev, location: e.target.value }))
                    }
                    placeholder="Project location"
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={projectForm.startDate}
                    onChange={(e) =>
                      setProjectForm((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={projectForm.endDate}
                    onChange={(e) =>
                      setProjectForm((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label>Partners</Label>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (!projectForm.partnerIds.includes(value)) {
                        setProjectForm((prev) => ({
                          ...prev,
                          partnerIds: [...prev.partnerIds, value],
                        }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Add partners" />
                    </SelectTrigger>
                    <SelectContent>
                      {partnersQuery?.data?.map((partner: Partner) => (
                        <SelectItem
                          key={partner._id}
                          value={partner._id}
                          disabled={projectForm.partnerIds.includes(partner._id)}
                        >
                          {partner.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {projectForm.partnerIds.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {projectForm.partnerIds.map((partnerId) => {
                        const partner = partnersQuery?.data?.find((p: Partner) => p._id === partnerId);
                        return (
                          <Badge key={partnerId} variant="secondary" className="text-xs">
                            {partner?.name}
                            <button
                              type="button"
                              onClick={() =>
                                setProjectForm((prev) => ({
                                  ...prev,
                                  partnerIds: prev.partnerIds.filter((id) => id !== partnerId),
                                }))
                              }
                              className="ml-1 text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="col-span-2 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={projectForm.isFeatured}
                    onChange={(e) =>
                      setProjectForm((prev) => ({ ...prev, isFeatured: e.target.checked }))
                    }
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="featured">Featured Project</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <FileUpload
                label="Featured Image"
                description="Upload an image to represent this project"
                accept="image/*"
                maxSize={10}
                currentFiles={projectImage}
                onFilesChange={setProjectImage}
                onError={(error) => setError(error)}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lat">Latitude (Optional)</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="any"
                    value={projectForm.coordinates.lat}
                    onChange={(e) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        coordinates: { ...prev.coordinates, lat: parseFloat(e.target.value) || 0 },
                      }))
                    }
                    placeholder="0.0000"
                  />
                </div>
                <div>
                  <Label htmlFor="lng">Longitude (Optional)</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="any"
                    value={projectForm.coordinates.lng}
                    onChange={(e) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        coordinates: { ...prev.coordinates, lng: parseFloat(e.target.value) || 0 },
                      }))
                    }
                    placeholder="0.0000"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={
                isLoading ||
                !projectForm.title ||
                !projectForm.description ||
                !projectForm.hubId ||
                !projectForm.theme ||
                !projectForm.location ||
                !projectForm.startDate
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update project information and settings.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="edit-title">Project Title *</Label>
                  <Input
                    id="edit-title"
                    value={projectForm.title}
                    onChange={(e) =>
                      setProjectForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Enter project title"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-description">Description *</Label>
                  <Textarea
                    id="edit-description"
                    value={projectForm.description}
                    onChange={(e) =>
                      setProjectForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Describe the project..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-hub">Hub *</Label>
                  <Select
                    value={projectForm.hubId}
                    onValueChange={(value) =>
                      setProjectForm((prev) => ({ ...prev, hubId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select hub" />
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
                <div>
                  <Label htmlFor="edit-status">Status *</Label>
                  <Select
                    value={projectForm.status}
                    onValueChange={(value: "ongoing" | "completed") =>
                      setProjectForm((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-theme">Theme *</Label>
                  <Input
                    id="edit-theme"
                    value={projectForm.theme}
                    onChange={(e) =>
                      setProjectForm((prev) => ({ ...prev, theme: e.target.value }))
                    }
                    placeholder="e.g., Water Quality, Sanitation"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-location">Location *</Label>
                  <Input
                    id="edit-location"
                    value={projectForm.location}
                    onChange={(e) =>
                      setProjectForm((prev) => ({ ...prev, location: e.target.value }))
                    }
                    placeholder="Project location"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-startDate">Start Date *</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={projectForm.startDate}
                    onChange={(e) =>
                      setProjectForm((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-endDate">End Date</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={projectForm.endDate}
                    onChange={(e) =>
                      setProjectForm((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label>Partners</Label>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (!projectForm.partnerIds.includes(value)) {
                        setProjectForm((prev) => ({
                          ...prev,
                          partnerIds: [...prev.partnerIds, value],
                        }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Add partners" />
                    </SelectTrigger>
                    <SelectContent>
                      {partnersQuery?.data?.map((partner: Partner) => (
                        <SelectItem
                          key={partner._id}
                          value={partner._id}
                          disabled={projectForm.partnerIds.includes(partner._id)}
                        >
                          {partner.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {projectForm.partnerIds.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {projectForm.partnerIds.map((partnerId) => {
                        const partner = partnersQuery?.data?.find((p: Partner) => p._id === partnerId);
                        return (
                          <Badge key={partnerId} variant="secondary" className="text-xs">
                            {partner?.name}
                            <button
                              type="button"
                              onClick={() =>
                                setProjectForm((prev) => ({
                                  ...prev,
                                  partnerIds: prev.partnerIds.filter((id) => id !== partnerId),
                                }))
                              }
                              className="ml-1 text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="col-span-2 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-featured"
                    checked={projectForm.isFeatured}
                    onChange={(e) =>
                      setProjectForm((prev) => ({ ...prev, isFeatured: e.target.checked }))
                    }
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="edit-featured">Featured Project</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <FileUpload
                label="Featured Image"
                description="Upload an image to represent this project"
                accept="image/*"
                maxSize={10}
                currentFiles={projectImage}
                onFilesChange={setProjectImage}
                onError={(error) => setError(error)}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-lat">Latitude (Optional)</Label>
                  <Input
                    id="edit-lat"
                    type="number"
                    step="any"
                    value={projectForm.coordinates.lat}
                    onChange={(e) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        coordinates: { ...prev.coordinates, lat: parseFloat(e.target.value) || 0 },
                      }))
                    }
                    placeholder="0.0000"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-lng">Longitude (Optional)</Label>
                  <Input
                    id="edit-lng"
                    type="number"
                    step="any"
                    value={projectForm.coordinates.lng}
                    onChange={(e) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        coordinates: { ...prev.coordinates, lng: parseFloat(e.target.value) || 0 },
                      }))
                    }
                    placeholder="0.0000"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setEditingProject(null);
                resetForm();
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateProject}
              disabled={
                isLoading ||
                !projectForm.title ||
                !projectForm.description ||
                !projectForm.hubId ||
                !projectForm.theme ||
                !projectForm.location ||
                !projectForm.startDate
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Project"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deletingProject?.title}</span>? This
              action cannot be undone and will remove the project permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false);
                setDeletingProject(null);
                setError(null);
              }}
              disabled={isLoading}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Project"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function ProjectPage() {
  return (
    <Suspense fallback={<ProjectCardSkeleton />}>
      <ProjectsPageContent />
    </Suspense>
  );
};
