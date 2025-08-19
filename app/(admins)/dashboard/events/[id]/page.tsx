"use client";

import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
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
  ExternalLink,
  Globe,
  MapPin,
  Clock,
  Users,
  Building2,
  User,
  Image as ImageIcon,
  Video,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface Event {
  _id: string;
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
  featuredImageId?: string;
  featuredImage?: string;
  hubId?: string;
  isActive: boolean;
  createdAt: number;
  createdBy: string;

  organizer?: {
    _id: string;
    name: string;
    email: string;
    profileImageId?: string;
    profileImage?: string;
  };
  hub?: {
    _id: string;
    name: string;
    description: string;
    imageId?: string;
    image?: string;
  };
}

function EventDetailsSkeleton() {
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

export default function EventDetailsPage() {
  const { user } = useAuth();
  const params = useParams();
  const eventId = params.id as string;

  const eventQuery = useQuery(
    api.events.getEvent,
    eventId ? { eventId: eventId as Id<"events"> } : "skip"
  );

  const isLoading = eventQuery === undefined;
  const event = eventQuery?.data as Event | undefined;
  const error = eventQuery?.error;

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

  const getEventStatus = () => {
    if (!event) return null;
    
    const now = Date.now();
    if (now < event.startDate) return "upcoming";
    if (now >= event.startDate && now <= event.endDate) return "ongoing";
    return "ended";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ongoing":
        return "bg-green-100 text-green-800 border-green-200";
      case "ended":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const isRegistrationOpen = () => {
    if (!event || !event.registrationRequired) return false;
    if (!event.registrationDeadline) return true;
    return Date.now() < event.registrationDeadline;
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <EventDetailsSkeleton />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || "Event not found"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const eventStatus = getEventStatus();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>

        {user?.isGlobalAdmin && (
          <Button asChild>
            <Link href={`/dashboard/events?edit=${event._id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Event
            </Link>
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Image */}
          {event.featuredImage ? (
            <div className="aspect-video relative overflow-hidden rounded-lg">
              <Image
                src={event.featuredImage}
                alt={event.title}
                layout="responsive"
                width={700}
                height={475}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-4 right-4">
                <Badge className={`${getTypeColor(event.type)}`}>
                  {getTypeLabel(event.type)}
                </Badge>
              </div>
              {eventStatus && (
                <div className="absolute top-4 left-4">
                  <Badge className={`${getStatusColor(eventStatus)}`}>
                    {eventStatus.charAt(0).toUpperCase() + eventStatus.slice(1)}
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

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className={`text-sm border ${getTypeColor(event.type)}`}>
                  {getTypeLabel(event.type)}
                </Badge>
                {event.hub && (
                  <Badge variant="outline" className="text-sm">
                    <Building2 className="h-3 w-3 mr-1" />
                    {event.hub.name}
                  </Badge>
                )}
                {event.isOnline ? (
                  <Badge variant="secondary" className="text-sm">
                    <Globe className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    In-person
                  </Badge>
                )}
                {eventStatus && (
                  <Badge className={`text-sm border ${getStatusColor(eventStatus)}`}>
                    {eventStatus.charAt(0).toUpperCase() + eventStatus.slice(1)}
                  </Badge>
                )}
              </div>

              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Event Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Start</Label>
                  <p className="text-lg font-medium">{formatDateTime(event.startDate)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">End</Label>
                  <p className="text-lg font-medium">{formatDateTime(event.endDate)}</p>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    Duration: {Math.round((event.endDate - event.startDate) / (1000 * 60 * 60))} hours
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Location/Meeting Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {event.isOnline ? (
                    <Video className="h-5 w-5 mr-2" />
                  ) : (
                    <MapPin className="h-5 w-5 mr-2" />
                  )}
                  {event.isOnline ? "Meeting Details" : "Location"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {event.isOnline ? (
                  <div className="space-y-3">
                    <p className="text-gray-700">This is an online event.</p>
                    {event.meetingLink && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Meeting Link</Label>
                        <div className="mt-1">
                          <a
                            href={event.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center"
                          >
                            <Globe className="h-4 w-4 mr-2" />
                            Join Meeting
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {event.location ? (
                      <p className="text-gray-700">{event.location}</p>
                    ) : (
                      <p className="text-muted-foreground italic">Location to be determined</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Organizer */}
            {event.organizer && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Organizer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    {event.organizer.profileImage ? (
                      <Image
                        src={event.organizer.profileImage}
                        alt={event.organizer.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium">{event.organizer.name}</h4>
                      <p className="text-sm text-muted-foreground">{event.organizer.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                <div className="mt-1">
                  <Badge className={`border ${getTypeColor(event.type)}`}>
                    {getTypeLabel(event.type)}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                <div className="mt-1">
                  <Badge className={`border ${getStatusColor(eventStatus!)}`}>
                    {eventStatus!.charAt(0).toUpperCase() + eventStatus!.slice(1)}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Format</Label>
                <div className="mt-1 flex items-center text-sm">
                  {event.isOnline ? (
                    <>
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Online Event</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>In-person Event</span>
                    </>
                  )}
                </div>
              </div>

              {event.maxAttendees && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Capacity</Label>
                    <div className="mt-1 flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Max {event.maxAttendees} attendees</span>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Registration</Label>
                <div className="mt-1 flex items-center text-sm">
                  {event.registrationRequired ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      <span>Required</span>
                      {event.registrationDeadline && (
                        <div className="ml-auto text-xs text-muted-foreground">
                          Until {new Date(event.registrationDeadline).toLocaleDateString()}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2 text-red-600" />
                      <span>Not required</span>
                    </>
                  )}
                </div>
                {event.registrationRequired && event.registrationDeadline && (
                  <div className="mt-2">
                    <Badge 
                      variant={isRegistrationOpen() ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {isRegistrationOpen() ? "Registration Open" : "Registration Closed"}
                    </Badge>
                  </div>
                )}
              </div>

              {event.hub && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Hub</Label>
                    <p className="mt-1 text-sm font-medium">{event.hub.name}</p>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                <p className="mt-1 text-sm">
                  {new Date(event.createdAt).toLocaleDateString()}
                </p>
              </div>
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
                  <Link href={`/dashboard/events?edit=${event._id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Event
                  </Link>
                </Button>

                <Button variant="outline" asChild className="w-full">
                  <Link href="/events">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go to Events (Website view)
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Related Events */}
          {event.hub && (
            <Card>
              <CardHeader>
                <CardTitle>Hub Events</CardTitle>
                <CardDescription>
                  Other events from {event.hub.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/dashboard/events?hub=${event.hubId}`}>
                    <Building2 className="h-4 w-4 mr-2" />
                    View Hub Events
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}