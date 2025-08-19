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
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Users,
  Image as ImageIcon,
  Video,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import FileUpload from "@/components/ui/file-upload";

interface Event {
  _id: Id<"events">;
  _creationTime: number;
  title: string;
  description: string;
  type: "event" | "knowledge_session";
  startDate: number;
  endDate: number;
  location?: string;
  isOnline: boolean;
  meetingLink?: string;
  maxAttendees?: number;
  registrationRequired: boolean;
  registrationDeadline?: number;
  featuredImageId?: Id<"_storage">; // Storage ID for file management  
  featuredImage?: string | null; // URL for display
  hubId?: Id<"hubs">;
  isActive: boolean;
  createdAt: number;
  createdBy: Id<"users">;

  organizer?: {
    _id: Id<"users">;
    name: string;
    email: string;
    profileImageId?: Id<"_storage">; // Storage ID for file management
    profileImage?: string | null; // URL for display
  } | null;
  hub?: {
    _id: Id<"hubs">;
    name: string;
    description: string;
    imageId?: Id<"_storage">; // Storage ID for file management
    image?: string | null; // URL for display
  } | null;
}

interface Hub {
  _id: Id<"hubs">;
  name: string;
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

function EventCardSkeleton() {
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

const EventsPageContent = () => {
  const { user, currentToken } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const editParam = searchParams.get('edit');
  const typeParam = searchParams.get('type');
  const upcomingParam = searchParams.get('upcoming');

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "event" | "knowledge_session">("all");
  const [upcomingFilter, setUpcomingFilter] = useState<"all" | "upcoming" | "past">("all");
  const [hubFilter, setHubFilter] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const eventsQuery = useQuery(api.events.getEvents, {});
  const hubsQuery = useQuery(api.hubs.getHubs, { activeOnly: true });

  const createEvent = useMutation(api.events.createEvent);
  const updateEvent = useMutation(api.events.updateEvent);
  const deleteEvent = useMutation(api.events.deleteEvent);

  useEffect(() => {
    if (typeParam && (typeParam === "event" || typeParam === "knowledge_session")) {
      setTypeFilter(typeParam);
    }
    if (upcomingParam && upcomingParam === "true") {
      setUpcomingFilter("upcoming");
    }
  }, [typeParam, upcomingParam]);

  useEffect(() => {
    if (!eventsQuery?.data || !editParam || !user?.isGlobalAdmin) return;

    const eventToEdit = eventsQuery.data.find((e: Event) => e._id === editParam);
    if (eventToEdit) {
      setEditingEvent(eventToEdit);
      setEventForm({
        title: eventToEdit.title,
        description: eventToEdit.description,
        type: eventToEdit.type,
        startDate: new Date(eventToEdit.startDate).toISOString().slice(0, 16),
        endDate: new Date(eventToEdit.endDate).toISOString().slice(0, 16),
        location: eventToEdit.location || "",
        isOnline: eventToEdit.isOnline,
        meetingLink: eventToEdit.meetingLink || "",
        maxAttendees: eventToEdit.maxAttendees?.toString() || "",
        registrationRequired: eventToEdit.registrationRequired,
        registrationDeadline: eventToEdit.registrationDeadline 
          ? new Date(eventToEdit.registrationDeadline).toISOString().slice(0, 16) 
          : "",
        hubId: eventToEdit.hubId || "",
      });
      setEventImage(
        eventToEdit.featuredImage && eventToEdit.featuredImageId
          ? [
            {
              _id: eventToEdit.featuredImageId,
              name: "Current Image",
              size: 0,
              type: "image/*",
              storageId: eventToEdit.featuredImageId,
              url: eventToEdit.featuredImage,
            },
          ]
          : []
      );
      setShowEditDialog(true);

      const newParams = new URLSearchParams(searchParams);
      newParams.delete('edit');
      const newUrl = newParams.toString() ? `?${newParams.toString()}` : '/dashboard/events';
      router.replace(newUrl, { scroll: false });
    }
  }, [eventsQuery?.data, editParam, user?.isGlobalAdmin, searchParams, router]);

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    type: "event" as "event" | "knowledge_session",
    startDate: "",
    endDate: "",
    location: "",
    isOnline: false,
    meetingLink: "",
    maxAttendees: "",
    registrationRequired: true,
    registrationDeadline: "",
    hubId: "",
  });

  const [eventImage, setEventImage] = useState<UploadedFile[]>([]);

  const isInitialLoading = eventsQuery === undefined || hubsQuery === undefined;

  const filteredEvents = useMemo(() => {
    if (!eventsQuery?.data) return [];

    return eventsQuery.data.filter((event: Event) => {
      // Search filter
      if (debouncedSearchTerm) {
        const searchLower = debouncedSearchTerm.toLowerCase();
        const matchesSearch =
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          (event.location?.toLowerCase().includes(searchLower) || false) ||
          (event.hub?.name?.toLowerCase().includes(searchLower) || false);

        if (!matchesSearch) return false;
      }

      // Type filter
      if (typeFilter !== "all" && event.type !== typeFilter) return false;

      // Hub filter
      if (hubFilter !== "all" && event.hub?._id !== hubFilter) return false;

      // Upcoming filter
      if (upcomingFilter === "upcoming" && event.startDate <= Date.now()) return false;
      return !(upcomingFilter === "past" && event.startDate > Date.now());


    });
  }, [eventsQuery, debouncedSearchTerm, typeFilter, upcomingFilter, hubFilter]);

  const resetForm = () => {
    setEventForm({
      title: "",
      description: "",
      type: "event",
      startDate: "",
      endDate: "",
      location: "",
      isOnline: false,
      meetingLink: "",
      maxAttendees: "",
      registrationRequired: true,
      registrationDeadline: "",
      hubId: "",
    });
    setEventImage([]);
    setError(null);
  };

  const handleCreateEvent = async () => {
    if (!currentToken) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await createEvent({
        title: eventForm.title,
        description: eventForm.description,
        type: eventForm.type,
        startDate: new Date(eventForm.startDate).getTime(),
        endDate: new Date(eventForm.endDate).getTime(),
        location: eventForm.location || undefined,
        isOnline: eventForm.isOnline,
        meetingLink: eventForm.meetingLink || undefined,
        maxAttendees: eventForm.maxAttendees ? parseInt(eventForm.maxAttendees) : undefined,
        registrationRequired: eventForm.registrationRequired,
        registrationDeadline: eventForm.registrationDeadline 
          ? new Date(eventForm.registrationDeadline).getTime() 
          : undefined,
        featuredImage: eventImage[0]?.storageId as Id<"_storage"> | undefined,
        hubId: eventForm.hubId as Id<"hubs"> | undefined,
        token: currentToken,
      });

      if (result.success) {
        toast.success("Event created successfully!");
        setShowCreateDialog(false);
        resetForm();
      } else {
        setError(result.error || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEvent = async () => {
    if (!currentToken || !editingEvent) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await updateEvent({
        eventId: editingEvent._id,
        title: eventForm.title,
        description: eventForm.description,
        type: eventForm.type,
        startDate: new Date(eventForm.startDate).getTime(),
        endDate: new Date(eventForm.endDate).getTime(),
        location: eventForm.location || undefined,
        isOnline: eventForm.isOnline,
        meetingLink: eventForm.meetingLink || undefined,
        maxAttendees: eventForm.maxAttendees ? parseInt(eventForm.maxAttendees) : undefined,
        registrationRequired: eventForm.registrationRequired,
        registrationDeadline: eventForm.registrationDeadline 
          ? new Date(eventForm.registrationDeadline).getTime() 
          : undefined,
        featuredImage: eventImage[0]?.storageId as Id<"_storage"> | undefined,
        hubId: eventForm.hubId as Id<"hubs"> | undefined,
        token: currentToken,
      });

      if (result.success) {
        toast.success("Event updated successfully!");
        setShowEditDialog(false);
        setEditingEvent(null);
        resetForm();
      } else {
        setError(result.error || "Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!currentToken || !deletingEvent) return;

    setIsLoading(true);
    try {
      const result = await deleteEvent({
        eventId: deletingEvent._id,
        token: currentToken,
      });

      if (result.success) {
        toast.success("Event deleted successfully!");
        setShowDeleteDialog(false);
        setDeletingEvent(null);
      } else {
        setError(result.error || "Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "event":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "knowledge_session":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "knowledge_session":
        return "Knowledge Session";
      default:
        return "Event";
    }
  };

  const isEventUpcoming = (startDate: number) => startDate > Date.now();

  if (!user) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please sign in to access events management.
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
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600">
            Manage events and knowledge sessions
          </p>
        </div>
        {user.isGlobalAdmin && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
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
            All Events ({filteredEvents.length})
          </h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={typeFilter} onValueChange={(value: "all" | "event" | "knowledge_session") => setTypeFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="event">Events</SelectItem>
                <SelectItem value="knowledge_session">Knowledge Sessions</SelectItem>
              </SelectContent>
            </Select>
            <Select value={upcomingFilter} onValueChange={(value: "all" | "upcoming" | "past") => setUpcomingFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>
            <Select value={hubFilter} onValueChange={setHubFilter}>
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
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || typeFilter !== "all" || upcomingFilter !== "all" || hubFilter !== "all"
                  ? "No events found matching your criteria"
                  : "No events found"}
              </p>
              {!searchTerm && user.isGlobalAdmin && (
                <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Event
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event: Event) => (
              <Card key={event._id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="aspect-video relative">
                  {event.featuredImage ? (
                    <Image
                      src={event.featuredImage}
                      alt={event.title}
                      fill
                      className="object-cover w-full h-full"
                      sizes="(max-width: 768px) 100vw, 700px"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge 
                      className={`${getTypeColor(event.type)} ${
                        isEventUpcoming(event.startDate) ? '' : 'opacity-75'
                      }`}
                    >
                      {getTypeLabel(event.type)}
                    </Badge>
                  </div>
                  {!isEventUpcoming(event.startDate) && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-gray-500 text-white">
                        Past
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        {event.hub && (
                          <Badge variant="outline" className="text-xs">
                            {event.hub.name}
                          </Badge>
                        )}
                        {event.isOnline ? (
                          <Badge variant="secondary" className="text-xs">
                            <Globe className="h-3 w-3 mr-1" />
                            Online
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            <MapPin className="h-3 w-3 mr-1" />
                            In-person
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
                            <Link href={`/dashboard/events/${event._id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingEvent(event);
                              setEventForm({
                                title: event.title,
                                description: event.description,
                                type: event.type,
                                startDate: new Date(event.startDate).toISOString().slice(0, 16),
                                endDate: new Date(event.endDate).toISOString().slice(0, 16),
                                location: event.location || "",
                                isOnline: event.isOnline,
                                meetingLink: event.meetingLink || "",
                                maxAttendees: event.maxAttendees?.toString() || "",
                                registrationRequired: event.registrationRequired,
                                registrationDeadline: event.registrationDeadline 
                                  ? new Date(event.registrationDeadline).toISOString().slice(0, 16) 
                                  : "",
                                hubId: event.hubId || "",
                              });
                              setEventImage(
                                event.featuredImage && event.featuredImageId
                                  ? [
                                    {
                                      _id: event.featuredImageId,
                                      name: "Current Image",
                                      size: 0,
                                      type: "image/*",
                                      storageId: event.featuredImageId,
                                      url: event.featuredImage,
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
                              setDeletingEvent(event);
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
                    {event.description}
                  </CardDescription>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span>
                        {new Date(event.startDate).toLocaleDateString()} {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    {event.location && !event.isOnline && (
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                    {event.isOnline && event.meetingLink && (
                      <div className="flex items-center">
                        <Video className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span className="truncate">Online Meeting</span>
                      </div>
                    )}
                    {event.maxAttendees && (
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span>Max {event.maxAttendees} attendees</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <Link href={`/dashboard/events/${event._id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Event
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Event Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Add a new event or knowledge session.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={eventForm.title}
                    onChange={(e) =>
                      setEventForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Enter event title"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={eventForm.description}
                    onChange={(e) =>
                      setEventForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Describe the event..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={eventForm.type}
                    onValueChange={(value: "event" | "knowledge_session") =>
                      setEventForm((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="knowledge_session">Knowledge Session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hub">Hub</Label>
                  <Select
                    value={eventForm.hubId}
                    onValueChange={(value) =>
                      setEventForm((prev) => ({ ...prev, hubId: value }))
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hub (optional)" />
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
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date & Time *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={eventForm.startDate}
                    onChange={(e) =>
                      setEventForm((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date & Time *</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={eventForm.endDate}
                    onChange={(e) =>
                      setEventForm((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                  />
                </div>
                <div className="col-span-2 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isOnline"
                    checked={eventForm.isOnline}
                    onChange={(e) =>
                      setEventForm((prev) => ({ ...prev, isOnline: e.target.checked }))
                    }
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isOnline">Online Event</Label>
                </div>
                {eventForm.isOnline ? (
                  <div className="col-span-2">
                    <Label htmlFor="meetingLink">Meeting Link</Label>
                    <Input
                      id="meetingLink"
                      type="url"
                      value={eventForm.meetingLink}
                      onChange={(e) =>
                        setEventForm((prev) => ({ ...prev, meetingLink: e.target.value }))
                      }
                      placeholder="https://..."
                    />
                  </div>
                ) : (
                  <div className="col-span-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={eventForm.location}
                      onChange={(e) =>
                        setEventForm((prev) => ({ ...prev, location: e.target.value }))
                      }
                      placeholder="Event location"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="maxAttendees">Max Attendees</Label>
                  <Input
                    id="maxAttendees"
                    type="number"
                    min="1"
                    value={eventForm.maxAttendees}
                    onChange={(e) =>
                      setEventForm((prev) => ({ ...prev, maxAttendees: e.target.value }))
                    }
                    placeholder="Unlimited"
                  />
                </div>
                <div className="col-span-2 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="registrationRequired"
                    checked={eventForm.registrationRequired}
                    onChange={(e) =>
                      setEventForm((prev) => ({ ...prev, registrationRequired: e.target.checked }))
                    }
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="registrationRequired">Registration Required</Label>
                </div>
                {eventForm.registrationRequired && (
                  <div className="col-span-2">
                    <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                    <Input
                      id="registrationDeadline"
                      type="datetime-local"
                      value={eventForm.registrationDeadline}
                      onChange={(e) =>
                        setEventForm((prev) => ({ ...prev, registrationDeadline: e.target.value }))
                      }
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <FileUpload
                label="Featured Image"
                description="Upload an image to represent this event"
                accept="image/*"
                maxSize={10}
                currentFiles={eventImage}
                onFilesChange={setEventImage}
                onError={(error) => setError(error)}
              />
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateEvent}
              disabled={
                isLoading ||
                !eventForm.title ||
                !eventForm.description ||
                !eventForm.startDate ||
                !eventForm.endDate
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update event information and settings.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="edit-title">Event Title *</Label>
                  <Input
                    id="edit-title"
                    value={eventForm.title}
                    onChange={(e) =>
                      setEventForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Enter event title"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-description">Description *</Label>
                  <Textarea
                    id="edit-description"
                    value={eventForm.description}
                    onChange={(e) =>
                      setEventForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Describe the event..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-type">Type *</Label>
                  <Select
                    value={eventForm.type}
                    onValueChange={(value: "event" | "knowledge_session") =>
                      setEventForm((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="knowledge_session">Knowledge Session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-hub">Hub</Label>
                  <Select
                    value={eventForm.hubId}
                    onValueChange={(value) =>
                      setEventForm((prev) => ({ ...prev, hubId: value }))
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hub (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Hub</SelectItem>
                      {hubsQuery?.data?.map((hub: Hub) => (
                        <SelectItem key={hub._id} value={hub._id}>
                          {hub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-startDate">Start Date & Time *</Label>
                  <Input
                    id="edit-startDate"
                    type="datetime-local"
                    value={eventForm.startDate}
                    onChange={(e) =>
                      setEventForm((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-endDate">End Date & Time *</Label>
                  <Input
                    id="edit-endDate"
                    type="datetime-local"
                    value={eventForm.endDate}
                    onChange={(e) =>
                      setEventForm((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                  />
                </div>
                <div className="col-span-2 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-isOnline"
                    checked={eventForm.isOnline}
                    onChange={(e) =>
                      setEventForm((prev) => ({ ...prev, isOnline: e.target.checked }))
                    }
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="edit-isOnline">Online Event</Label>
                </div>
                {eventForm.isOnline ? (
                  <div className="col-span-2">
                    <Label htmlFor="edit-meetingLink">Meeting Link</Label>
                    <Input
                      id="edit-meetingLink"
                      type="url"
                      value={eventForm.meetingLink}
                      onChange={(e) =>
                        setEventForm((prev) => ({ ...prev, meetingLink: e.target.value }))
                      }
                      placeholder="https://..."
                    />
                  </div>
                ) : (
                  <div className="col-span-2">
                    <Label htmlFor="edit-location">Location</Label>
                    <Input
                      id="edit-location"
                      value={eventForm.location}
                      onChange={(e) =>
                        setEventForm((prev) => ({ ...prev, location: e.target.value }))
                      }
                      placeholder="Event location"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="edit-maxAttendees">Max Attendees</Label>
                  <Input
                    id="edit-maxAttendees"
                    type="number"
                    min="1"
                    value={eventForm.maxAttendees}
                    onChange={(e) =>
                      setEventForm((prev) => ({ ...prev, maxAttendees: e.target.value }))
                    }
                    placeholder="Unlimited"
                  />
                </div>
                <div className="col-span-2 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-registrationRequired"
                    checked={eventForm.registrationRequired}
                    onChange={(e) =>
                      setEventForm((prev) => ({ ...prev, registrationRequired: e.target.checked }))
                    }
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="edit-registrationRequired">Registration Required</Label>
                </div>
                {eventForm.registrationRequired && (
                  <div className="col-span-2">
                    <Label htmlFor="edit-registrationDeadline">Registration Deadline</Label>
                    <Input
                      id="edit-registrationDeadline"
                      type="datetime-local"
                      value={eventForm.registrationDeadline}
                      onChange={(e) =>
                        setEventForm((prev) => ({ ...prev, registrationDeadline: e.target.value }))
                      }
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <FileUpload
                label="Featured Image"
                description="Upload an image to represent this event"
                accept="image/*"
                maxSize={10}
                currentFiles={eventImage}
                onFilesChange={setEventImage}
                onError={(error) => setError(error)}
              />
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setEditingEvent(null);
                resetForm();
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateEvent}
              disabled={
                isLoading ||
                !eventForm.title ||
                !eventForm.description ||
                !eventForm.startDate ||
                !eventForm.endDate
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Event"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Event Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deletingEvent?.title}</span>? This
              action cannot be undone and will remove the event permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false);
                setDeletingEvent(null);
                setError(null);
              }}
              disabled={isLoading}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEvent}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Event"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<EventCardSkeleton />}>
      <EventsPageContent />
    </Suspense>
  );
};