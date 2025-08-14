"use client";

import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import React, { useState, useRef, useEffect } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle,
  Download,
  Eye,
  Plus,
  Search,
  Upload,
  User,
  Users,
  XCircle,
  Loader2,
  FileText,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

interface MembershipApplication {
  _id: string;
  applicantName: string;
  applicantEmail: string;
  applicationData: any;
  formSnapshot: any[];
  status: "pending" | "approved" | "rejected";
  submittedAt: number;
  reviewedAt?: number;
  reviewedBy?: string;
  notes?: string;
  reviewer?: {
    _id: string;
    name: string;
  };
}

interface Member {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  globalRole: "member" | "admin" | "superadmin";
  profileImage?: string;
  bio?: string;
  position?: string;
  emailVerified: boolean;
  joinedAt: number;
  isActive: boolean;
  hubMemberships: Array<{
    hubId: string;
    role: "member" | "lead";
    hub: {
      name: string;
      _id: string;
    } | null;
  }>;
}

interface BulkImportMember {
  name: string;
  email: string;
  phone?: string;
  position?: string;
  bio?: string;
}

function ApplicationTableSkeleton() {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reviewer</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-40" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-6 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-28" /></TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function MemberTableSkeleton() {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Hub Memberships</TableHead>
            <TableHead>Joined Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-40" /></TableCell>
              <TableCell><Skeleton className="h-6 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-48" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-6 w-16" /></TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function MembershipPage() {
  const { user, currentToken } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"pending" | "approved" | "rejected">("pending");
  const [memberRoleFilter, setMemberRoleFilter] = useState<"member" | "admin" | "superadmin" | "all">("all");
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showBulkImportDialog, setShowBulkImportDialog] = useState(false);
  const [showApplicationDetailsDialog, setShowApplicationDetailsDialog] = useState(false);
  const [showEditMemberDialog, setShowEditMemberDialog] = useState(false);
  const [reviewingApplication, setReviewingApplication] = useState<MembershipApplication | null>(null);
  const [viewingApplication, setViewingApplication] = useState<MembershipApplication | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bulkImportData, setBulkImportData] = useState<BulkImportMember[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const applicationQuery = useQuery(
    api.membership.getMembershipApplications,
    currentToken
      ? {
        paginationOpts: { numItems: 20, cursor: null },
        status: statusFilter,
        search: debouncedSearchTerm,
        token: currentToken,
      }
      : "skip",
  );

  const membersQuery = useQuery(
    api.membership.getMembers,
    currentToken
      ? {
        paginationOpts: { numItems: 20, cursor: null },
        search: debouncedSearchTerm,
        role: memberRoleFilter !== "all" ? memberRoleFilter : undefined,
        token: currentToken,
      }
      : "skip",
  );

  const reviewApplication = useMutation(api.membership.reviewMembershipApplication);
  const createMember = useMutation(api.membership.createMember);
  const createAdminUser = useMutation(api.auth.createAdminUser);
  const updateMember = useMutation(api.membership.updateMember);

  const [reviewForm, setReviewForm] = useState({
    status: "approved" as "approved" | "rejected",
    notes: "",
  });

  const [newMemberForm, setNewMemberForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "member" as "member" | "admin" | "superadmin",
  });

  const [editMemberForm, setEditMemberForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "member" as "member" | "admin" | "superadmin",
    isActive: true,
  });

  if (!user) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please sign in to access membership management.
        </AlertDescription>
      </Alert>
    );
  }

  if (!user.isGlobalAdmin) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You need admin privileges to manage memberships.
        </AlertDescription>
      </Alert>
    );
  }

  const isInitialLoading = applicationQuery === undefined || membersQuery === undefined;

  const handleReviewApplication = async () => {
    if (!currentToken || !reviewingApplication) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await reviewApplication({
        applicationId: reviewingApplication._id as Id<"membershipApplications">,
        status: reviewForm.status,
        notes: reviewForm.notes,
        token: currentToken,
      });

      if (result.success) {
        toast.success(`Application ${reviewForm.status} successfully!`);
        setShowReviewDialog(false);
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

  const handleAddMember = async () => {
    if (!currentToken) return;

    setIsLoading(true);
    setError(null);
    try {
      const role = newMemberForm.role;

      let result;

      if (role === "member") {
        result = await createMember({
          name: newMemberForm.name,
          email: newMemberForm.email,
          phone: newMemberForm.phone,
          globalRole: role,
          token: currentToken,
        });
      } else if (role === "admin") {
        result = await createAdminUser({
          name: newMemberForm.name,
          email: newMemberForm.email,
          phone: newMemberForm.phone,
          globalRole: role,
          token: currentToken,
        });
      } else {

        setError("Invalid role selected");
      }
      if (result?.success) {
        toast.success("Member added successfully! Welcome email sent.");
        setShowAddMemberDialog(false);
        setNewMemberForm({
          name: "",
          email: "",
          phone: "",
          role: "member",
        });
      } else {
        setError(result?.error || "Failed to add member");
      }
    } catch (error) {
      console.error("Error adding member:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMember = async () => {
    if (!currentToken || !editingMember) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await updateMember({
        memberId: editingMember._id as Id<"users">,
        name: editMemberForm.name,
        email: editMemberForm.email,
        phone: editMemberForm.phone,
        globalRole: editMemberForm.role,
        isActive: editMemberForm.isActive,
        token: currentToken,
      });

      if (result.success) {
        toast.success("Member updated successfully!");
        setShowEditMemberDialog(false);
        setEditingMember(null);
      } else {
        setError(result.error || "Failed to update member");
      }
    } catch (error) {
      console.error("Error updating member:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError("Please upload a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
          setError("CSV file must have at least a header row and one data row");
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));

        const requiredHeaders = ['name', 'email'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

        if (missingHeaders.length > 0) {
          setError(`Missing required columns: ${missingHeaders.join(', ')}`);
          return;
        }

        const members: BulkImportMember[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          if (values.length < 2) continue;

          const member: BulkImportMember = {
            name: values[headers.indexOf('name')] || '',
            email: values[headers.indexOf('email')] || '',
            phone: values[headers.indexOf('phone')] || undefined,
            position: values[headers.indexOf('position')] || undefined,
            bio: values[headers.indexOf('bio')] || undefined,
          };

          if (member.name && member.email && member.email.includes('@')) {
            members.push(member);
          }
        }

        if (members.length === 0) {
          setError("No valid member data found in CSV");
          return;
        }

        setBulkImportData(members);
        setError(null);
        toast.success(`Parsed ${members.length} members from CSV`);
      } catch (error) {
        console.error("Failed to parse CSV", error)
        setError("Failed to parse CSV file. Please check the format.");
      }
    };
    reader.readAsText(file);
  };

  const handleBulkImport = async () => {
    if (!currentToken || bulkImportData.length === 0) return;

    setIsLoading(true);
    setImportProgress(0);
    setError(null);

    try {
      let successCount = 0;
      let errorCount = 0;
      const total = bulkImportData.length;

      for (let i = 0; i < bulkImportData.length; i++) {
        const member = bulkImportData[i];

        try {
          const result = await createMember({
            name: member.name,
            email: member.email,
            phone: member.phone,
            globalRole: "member",
            token: currentToken,
          });

          if (result.success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          console.error("Error creating member", error);
          errorCount++;
        }

        setImportProgress(Math.round(((i + 1) / total) * 100));

        if (i < bulkImportData.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} members. ${errorCount} errors.`);
      } else {
        setError(`Failed to import any members. ${errorCount} errors occurred.`);
      }

      if (errorCount === 0) {
        setShowBulkImportDialog(false);
        setBulkImportData([]);
      }
    } catch (error) {
      console.error("Error bulk importing:", error);
      setError("An unexpected error occurred during import");
    } finally {
      setIsLoading(false);
      setImportProgress(0);
    }
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "admin":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "member":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getActiveStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-600 text-white"
      : "bg-red-100 text-red-800 border-red-200";
  };

  const downloadCSVTemplate = () => {
    const csvContent = "name,email,phone,position,bio\nJohn Doe,john@example.com,+250781234567,Water Engineer,Experienced in WASH projects\nJane Smith,jane@example.com,+250781234568,Project Manager,Community development specialist";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'member_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isInitialLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>
          <TabsContent value="applications">
            <ApplicationTableSkeleton />
          </TabsContent>
          <TabsContent value="members">
            <MemberTableSkeleton />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Membership Management</h1>
          <p className="text-gray-600">
            Manage membership applications and existing members
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog open={showBulkImportDialog} onOpenChange={setShowBulkImportDialog}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Membership Applications</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
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
            </div>
          </div>

          {!applicationQuery ? (
            <ApplicationTableSkeleton />
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applicationQuery.error ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-2">
                          <FileText className="h-12 w-12 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            {applicationQuery.error || "Failed to load applications"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : applicationQuery.page?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-2">
                          <FileText className="h-12 w-12 text-muted-foreground" />
                          <p className="text-muted-foreground">No applications found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    applicationQuery.page?.map((application) => (
                      <TableRow key={application._id}>
                        <TableCell className="font-medium">
                          {application.applicantName}
                        </TableCell>
                        <TableCell>{application.applicantEmail}</TableCell>
                        <TableCell>
                          {new Date(application.submittedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={`border ${getStatusColor(application.status)}`}>
                            {application.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {application.reviewer?.name || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setViewingApplication(application as any);
                                setShowApplicationDetailsDialog(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {application.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={() => {
                                    setReviewingApplication(application as any);
                                    setReviewForm({ status: "approved", notes: "" });
                                    setShowReviewDialog(true);
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
                                    setShowReviewDialog(true);
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Existing Members</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={memberRoleFilter} onValueChange={(value: "member" | "admin" | "superadmin" | "all") => setMemberRoleFilter(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="member">Members</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  <SelectItem value="superadmin">Super Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!membersQuery ? (
            <MemberTableSkeleton />
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Hub Memberships</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {membersQuery.error ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-2">
                          <Users className="h-12 w-12 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            {membersQuery.error || "Failed to load members"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : membersQuery.page?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-2">
                          <Users className="h-12 w-12 text-muted-foreground" />
                          <p className="text-muted-foreground">No members found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    membersQuery.page?.map((member) => (
                      <TableRow key={member._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>{member.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          <Badge className={`border ${getRoleColor(member.globalRole)}`}>
                            {member.globalRole}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {member.hubMemberships.length === 0 ? (
                              <span className="text-muted-foreground text-sm">None</span>
                            ) : (
                              member.hubMemberships.map((membership, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {membership.hub?.name} ({membership.role})
                                </Badge>
                              ))
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(member.joinedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={`border ${getActiveStatusColor(member.isActive)}`}>
                            {member.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setViewingApplication(member as any);
                                setShowApplicationDetailsDialog(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingMember(member);
                                setEditMemberForm({
                                  name: member.name,
                                  email: member.email,
                                  phone: member.phone || "",
                                  role: member.globalRole,
                                  isActive: member.isActive,
                                });
                                setShowEditMemberDialog(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>
              Add a new member to the organization. A welcome email will be sent with temporary credentials.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="member-name">Full Name</Label>
              <Input
                id="member-name"
                value={newMemberForm.name}
                onChange={(e) =>
                  setNewMemberForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="member-email">Email Address</Label>
              <Input
                id="member-email"
                type="email"
                value={newMemberForm.email}
                onChange={(e) =>
                  setNewMemberForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="member-phone">Phone Number (Optional)</Label>
              <Input
                id="member-phone"
                value={newMemberForm.phone}
                onChange={(e) =>
                  setNewMemberForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="member-role">Role</Label>
              <Select
                value={newMemberForm.role}
                onValueChange={(value: "member" | "admin" | "superadmin") =>
                  setNewMemberForm((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddMember}
              disabled={isLoading || !newMemberForm.name || !newMemberForm.email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Member"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={showEditMemberDialog} onOpenChange={setShowEditMemberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>
              Update member information and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-member-name">Full Name</Label>
              <Input
                id="edit-member-name"
                value={editMemberForm.name}
                onChange={(e) =>
                  setEditMemberForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="edit-member-email">Email Address</Label>
              <Input
                id="edit-member-email"
                type="email"
                value={editMemberForm.email}
                onChange={(e) =>
                  setEditMemberForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="edit-member-phone">Phone Number</Label>
              <Input
                id="edit-member-phone"
                value={editMemberForm.phone}
                onChange={(e) =>
                  setEditMemberForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="edit-member-role">Role</Label>
              <Select
                value={editMemberForm.role}
                onValueChange={(value: "member" | "admin" | "superadmin") =>
                  setEditMemberForm((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-member-active"
                checked={editMemberForm.isActive}
                onChange={(e) =>
                  setEditMemberForm((prev) => ({ ...prev, isActive: e.target.checked }))
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="edit-member-active">Active Member</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditMemberDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditMember}
              disabled={isLoading || !editMemberForm.name || !editMemberForm.email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Member"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog open={showBulkImportDialog} onOpenChange={setShowBulkImportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Import Members</DialogTitle>
            <DialogDescription>
              Upload a CSV file to import multiple members. All imported members will be given &#34;member&#34; role by default.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="csv-file">CSV File</Label>
              <Button variant="outline" size="sm" onClick={downloadCSVTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Required columns:</strong> name, email</p>
              <p><strong>Optional columns:</strong> phone, position, bio</p>
              <p><strong>Note:</strong> First row should contain column headers</p>
            </div>

            {bulkImportData.length > 0 && (
              <div>
                <Label>Preview ({bulkImportData.length} members)</Label>
                <div className="max-h-40 overflow-y-auto border rounded p-2 mt-2">
                  {bulkImportData.slice(0, 5).map((member, index) => (
                    <div key={index} className="text-sm py-1 flex justify-between">
                      <span>{member.name}</span>
                      <span className="text-muted-foreground">{member.email}</span>
                    </div>
                  ))}
                  {bulkImportData.length > 5 && (
                    <div className="text-sm text-muted-foreground pt-2">
                      ...and {bulkImportData.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {isLoading && importProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Importing members...</span>
                  <span>{importProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${importProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkImportDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleBulkImport}
              disabled={isLoading || bulkImportData.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                `Import ${bulkImportData.length} Members`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Application Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
            <DialogDescription>
              Review {reviewingApplication?.applicantName}&#39;s membership application
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
            <Button variant="outline" onClick={() => setShowReviewDialog(false)} disabled={isLoading}>
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

      {/* Application Details Dialog */}
      <Dialog open={showApplicationDetailsDialog} onOpenChange={setShowApplicationDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Detailed view of {viewingApplication?.applicantName || "Applicant"}&#39;s information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {viewingApplication?.applicantName && (
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-sm text-muted-foreground">{viewingApplication.applicantName}</p>
              </div>
              )}
              {viewingApplication?.applicantEmail && (
              <div>
                <Label className="text-sm font-medium">Email Address</Label>
                <p className="text-sm text-muted-foreground">{viewingApplication.applicantEmail}</p>
              </div>
              )}
              {viewingApplication?.submittedAt && (
                <div>
                  <Label className="text-sm font-medium">Application Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(viewingApplication.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              {viewingApplication?.status && (
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    <Badge className={`border ${getStatusColor(viewingApplication.status)}`}>
                      {viewingApplication.status}
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {viewingApplication?.applicationData && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Application Data</Label>
                <div className="border rounded-lg p-4 bg-muted/50 max-h-60 overflow-y-auto">
                  {Object.entries(viewingApplication.applicationData).map(([key, value]) => (
                    <div key={key} className="mb-3 last:mb-0">
                      <div className="text-sm font-medium capitalize mb-1">
                        {key.replace(/_/g, ' ')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {viewingApplication?.notes && (
              <div>
                <Label className="text-sm font-medium">Review Notes</Label>
                <p className="text-sm text-muted-foreground mt-1">{viewingApplication.notes}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplicationDetailsDialog(false)}>
              Close
            </Button>
            {viewingApplication?.status === "pending" && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                  onClick={() => {
                    setReviewingApplication(viewingApplication);
                    setReviewForm({ status: "approved", notes: "" });
                    setShowApplicationDetailsDialog(false);
                    setShowReviewDialog(true);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => {
                    setReviewingApplication(viewingApplication);
                    setReviewForm({ status: "rejected", notes: "" });
                    setShowApplicationDetailsDialog(false);
                    setShowReviewDialog(true);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}