"use client";

import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Building2,
  Users,
  Target,
  History,
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Save,
  AlertCircle,
  Edit,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

interface ContactInfo {
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  googleMapsLink?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface SocialMedia {
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  instagram?: string;
}

interface ContactFormData {
  address: string;
  phone: string;
  email: string;
  website: string;
  googleMapsLink: string;
  latitude: string;
  longitude: string;
}

interface SocialFormData {
  facebook: string;
  linkedin: string;
  twitter: string;
  youtube: string;
  instagram: string;
}

interface TextFormData {
  content: string;
}

type FormData = ContactFormData | SocialFormData | TextFormData;

export default function OrganizationPage() {
  const { user, currentToken } = useAuth();

  const visionQuery = useQuery(api.organization.getOrganizationInfo, { key: "vision" });
  const missionQuery = useQuery(api.organization.getOrganizationInfo, { key: "mission" });
  const coreValuesQuery = useQuery(api.organization.getOrganizationInfo, { key: "core_values" });
  const historyQuery = useQuery(api.organization.getOrganizationInfo, { key: "history" });
  const contactInfoQuery = useQuery(api.organization.getOrganizationInfo, { key: "contact_info" });
  const socialMediaQuery = useQuery(api.organization.getOrganizationInfo, { key: "social_media" });

  console.log("Social media query result:", socialMediaQuery);
  console.log("Contact info query result:", contactInfoQuery);

  const updateOrgInfo = useMutation(api.organization.updateOrganizationInfo);

  const [activeTab, setActiveTab] = useState<string>("about");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({} as FormData);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [editingSection]);

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Please sign in to access the organization management.</AlertDescription>
      </Alert>
    );
  }

  if (!user.isGlobalAdmin) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>You need admin privileges to manage organization information.</AlertDescription>
      </Alert>
    );
  }

  const isLoading = visionQuery === undefined || missionQuery === undefined ||
    coreValuesQuery === undefined || historyQuery === undefined ||
    contactInfoQuery === undefined || socialMediaQuery === undefined;

  const handleEdit = (section: string, currentData: any) => {
    setEditingSection(section);
    setError(null);

    if (section === "contact_info") {
      let contactData: ContactInfo = {};
      if (currentData) {
        try {
          contactData = JSON.parse(currentData);
        } catch (e) {
          console.error("Failed to parse contact info:", e);
          contactData = {};
        }
      }
      setFormData({
        address: contactData.address || "",
        phone: contactData.phone || "",
        email: contactData.email || "",
        website: contactData.website || "",
        googleMapsLink: contactData.googleMapsLink || "",
        latitude: contactData.coordinates?.lat?.toString() || "",
        longitude: contactData.coordinates?.lng?.toString() || "",
      } as ContactFormData);
    } else if (section === "social_media") {
      let socialData: SocialMedia = {};
      if (currentData) {
        try {
          socialData = JSON.parse(currentData);
        } catch (e) {
          console.error("Failed to parse social media info:", e);
          socialData = {};
        }
      }
      setFormData({
        facebook: socialData.facebook || "",
        linkedin: socialData.linkedin || "",
        twitter: socialData.twitter || "",
        youtube: socialData.youtube || "",
        instagram: socialData.instagram || "",
      } as SocialFormData);
    } else {
      setFormData({ content: currentData || "" } as TextFormData);
    }
  };

  const handleSave = async () => {
    if (!currentToken || !editingSection) return;

    setIsSaving(true);
    setError(null);

    try {
      let content: string;
      let type: "text" | "json";

      if (editingSection === "contact_info") {
        const data = formData as ContactFormData;
        const contactData: ContactInfo = {
          address: data.address.trim(),
          phone: data.phone.trim(),
          email: data.email.trim(),
          website: data.website.trim(),
          googleMapsLink: data.googleMapsLink.trim(),
        };

        if (data.latitude && data.longitude) {
          const lat = parseFloat(data.latitude);
          const lng = parseFloat(data.longitude);
          if (!isNaN(lat) && !isNaN(lng)) {
            contactData.coordinates = { lat, lng };
          }
        }

        content = JSON.stringify(contactData);
        type = "json";
      } else if (editingSection === "social_media") {
        const data = formData as SocialFormData;
        const socialData: SocialMedia = {
          facebook: data.facebook.trim(),
          linkedin: data.linkedin.trim(),
          twitter: data.twitter.trim(),
          youtube: data.youtube.trim(),
          instagram: data.instagram.trim(),
        };
        content = JSON.stringify(socialData);
        type = "json";
      } else {
        const data = formData as TextFormData;
        content = data.content.trim();
        type = "text";
      }

      const result = await updateOrgInfo({
        token: currentToken,
        key: editingSection,
        content,
        type,
      });

      if (result.success) {
        toast.success("Information updated successfully!");
        setEditingSection(null);
        setFormData({} as FormData);
      } else {
        setError(result.error || "Failed to update information");
      }
    } catch (error) {
      console.error("Error updating organization info:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setFormData({} as FormData);
    setError(null);
  };

  const updateContactFormData = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev as ContactFormData, [field]: value }));
  };

  const updateSocialFormData = (field: keyof SocialFormData, value: string) => {
    setFormData(prev => ({ ...prev as SocialFormData, [field]: value }));
  };

  const updateTextFormData = (value: string) => {
    setFormData({ content: value } as TextFormData);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="space-y-6">
          <div className="grid w-full grid-cols-3 h-10 bg-muted rounded-md p-1">
            <Skeleton className="h-8 rounded-sm" />
            <Skeleton className="h-8 rounded-sm" />
            <Skeleton className="h-8 rounded-sm" />
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const renderSection = (title: string, icon: any, sectionKey: string, currentData: any) => {
    const Icon = icon;
    const isEditing = editingSection === sectionKey;
    const data = currentData?.content;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log("Edit button clicked for:", sectionKey);
                  handleEdit(sectionKey, data);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isEditing ? (
            <div className="space-y-4">
              {sectionKey === "contact_info" ? (
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={(formData as ContactFormData).address || ""}
                        onChange={(e) =>
                          updateContactFormData("address", e.target.value)
                        }
                        placeholder="Office address..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={(formData as ContactFormData).phone || ""}
                          onChange={(e) =>
                            updateContactFormData("phone", e.target.value)
                          }
                          placeholder="+250 XXX XXX XXX"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={(formData as ContactFormData).email || ""}
                          onChange={(e) =>
                            updateContactFormData("email", e.target.value)
                          }
                          placeholder="info@rywp.org"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={(formData as ContactFormData).website || ""}
                          onChange={(e) =>
                            updateContactFormData("website", e.target.value)
                          }
                          placeholder="https://rywp.org"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="googleMapsLink">Google Maps Link</Label>
                    <Input
                      id="googleMapsLink"
                      value={(formData as ContactFormData).googleMapsLink || ""}
                      onChange={(e) =>
                        updateContactFormData("googleMapsLink", e.target.value)
                      }
                      placeholder="https://maps.google.com/..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        value={(formData as ContactFormData).latitude || ""}
                        onChange={(e) =>
                          updateContactFormData("latitude", e.target.value)
                        }
                        placeholder="-1.9441"
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        value={(formData as ContactFormData).longitude || ""}
                        onChange={(e) =>
                          updateContactFormData("longitude", e.target.value)
                        }
                        placeholder="30.0619"
                      />
                    </div>
                  </div>
                </div>
              ) : sectionKey === "social_media" ? (
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={(formData as SocialFormData).facebook || ""}
                      onChange={(e) =>
                        updateSocialFormData("facebook", e.target.value)
                      }
                      placeholder="https://facebook.com/rywp"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={(formData as SocialFormData).linkedin || ""}
                      onChange={(e) =>
                        updateSocialFormData("linkedin", e.target.value)
                      }
                      placeholder="https://linkedin.com/company/rywp"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter/X</Label>
                    <Input
                      id="twitter"
                      value={(formData as SocialFormData).twitter || ""}
                      onChange={(e) =>
                        updateSocialFormData("twitter", e.target.value)
                      }
                      placeholder="https://twitter.com/rywp"
                    />
                  </div>
                  <div>
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      value={(formData as SocialFormData).youtube || ""}
                      onChange={(e) =>
                        updateSocialFormData("youtube", e.target.value)
                      }
                      placeholder="https://youtube.com/@rywp"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={(formData as SocialFormData).instagram || ""}
                      onChange={(e) =>
                        updateSocialFormData("instagram", e.target.value)
                      }
                      placeholder="https://instagram.com/rywp"
                    />
                  </div>
                </div>
              ) : (
                <Textarea
                  value={(formData as TextFormData).content || ""}
                  onChange={(e) => updateTextFormData(e.target.value)}
                  placeholder={`Enter ${title.toLowerCase()}...`}
                  rows={6}
                  className="min-h-[150px]"
                />
              )}
              <div className="flex space-x-2">
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {sectionKey === "contact_info" ? (
                <div className="space-y-4">
                  {data ? (
                    (() => {
                      let contactData: ContactInfo;
                      try {
                        contactData = JSON.parse(data);
                      } catch (e) {
                        console.error("Failed to parse contact info:", e);
                        contactData = {};
                      }
                      return (
                        <div className="grid gap-4">
                          {contactData.address && (
                            <div className="flex items-start space-x-2">
                              <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                              <span className="text-sm">
                                {contactData.address}
                              </span>
                            </div>
                          )}
                          {contactData.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {contactData.phone}
                              </span>
                            </div>
                          )}
                          {contactData.email && (
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {contactData.email}
                              </span>
                            </div>
                          )}
                          {contactData.website && (
                            <div className="flex items-center space-x-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <a
                                href={contactData.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                {contactData.website}
                              </a>
                            </div>
                          )}
                          {contactData.googleMapsLink && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <a
                                href={contactData.googleMapsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center"
                              >
                                View on Google Maps
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                          )}
                          {contactData.coordinates && (
                            <div className="text-xs text-muted-foreground">
                              Coordinates: {contactData.coordinates.lat},{" "}
                              {contactData.coordinates.lng}
                            </div>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No contact information configured. Click edit to add
                      contact details.
                    </p>
                  )}
                </div>
              ) : sectionKey === "social_media" ? (
                <div className="space-y-3">
                  {data ? (
                    (() => {
                      let socialData: SocialMedia;
                      try {
                        socialData = JSON.parse(data);
                      } catch (e) {
                        console.error("Failed to parse social media info:", e);
                        socialData = {};
                      }
                      return (
                        <div className="grid gap-3">
                          {socialData.facebook && (
                            <div className="flex items-center space-x-2">
                              <Facebook className="h-4 w-4 text-blue-600" />
                              <a
                                href={socialData.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center"
                              >
                                Facebook
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                          )}
                          {socialData.linkedin && (
                            <div className="flex items-center space-x-2">
                              <Linkedin className="h-4 w-4 text-blue-700" />
                              <a
                                href={socialData.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center"
                              >
                                LinkedIn
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                          )}
                          {socialData.twitter && (
                            <div className="flex items-center space-x-2">
                              <Twitter className="h-4 w-4 text-sky-500" />
                              <a
                                href={socialData.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center"
                              >
                                Twitter/X
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                          )}
                          {socialData.youtube && (
                            <div className="flex items-center space-x-2">
                              <Youtube className="h-4 w-4 text-red-600" />
                              <a
                                href={socialData.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center"
                              >
                                YouTube
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                          )}
                          {socialData.instagram && (
                            <div className="flex items-center space-x-2">
                              <Instagram className="h-4 w-4 text-pink-600" />
                              <a
                                href={socialData.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center"
                              >
                                Instagram
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No social media links configured. Click edit to add social
                      media profiles.
                    </p>
                  )}
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  {data ? (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {data}
                    </p>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No {title.toLowerCase()} configured. Click edit to add
                      content.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organization Management</h1>
          <p className="text-gray-600">Manage RYWP&apos;s organizational information, contact details, and social media presence</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {user.isSuperAdmin ? "Super Admin" : "Admin"}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="about">About Us</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-6">
          <div className="grid gap-6">
            {renderSection("Vision", Target, "vision", visionQuery)}
            {renderSection("Mission", Building2, "mission", missionQuery)}
            {renderSection("Core Values", Users, "core_values", coreValuesQuery)}
            {renderSection("History & Founding Story", History, "history", historyQuery)}
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          {renderSection("Contact Information", MapPin, "contact_info", contactInfoQuery)}
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          {renderSection("Social Media Links", Globe, "social_media", socialMediaQuery)}
        </TabsContent>
      </Tabs>
    </div>
  );
}