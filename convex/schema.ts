import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const formFieldSchema = v.object({
  id: v.string(),
  label: v.string(),
  type: v.union(
    v.literal("text"),
    v.literal("email"),
    v.literal("textarea"),
    v.literal("select"),
    v.literal("radio"),
    v.literal("checkbox"),
    v.literal("tel"),
    v.literal("url"),
    v.literal("number"),
    v.literal("date"),
    v.literal("file") // Added file upload support
  ),
  required: v.boolean(),
  options: v.optional(v.array(v.string())), // for select, radio, checkbox
  placeholder: v.optional(v.string()),

  fileTypes: v.optional(v.array(v.string())), // e.g., ["pdf", "doc", "docx"]
  maxFileSize: v.optional(v.number()), // in bytes
  multiple: v.optional(v.boolean()), // allow multiple files

  minLength: v.optional(v.number()),
  maxLength: v.optional(v.number()),
  pattern: v.optional(v.string()), // regex pattern
});

const schema = defineSchema({
  ...authTables,

  users: defineTable({
    name: v.string(),
    email: v.string(),
    emailVerified: v.optional(v.boolean()),
    globalRole: v.union(v.literal("member"), v.literal("admin"), v.literal("superadmin")),
    temporaryAdminUntil: v.optional(v.number()),
    profileImage: v.optional(v.id("_storage")),
    bio: v.optional(v.string()),
    position: v.optional(v.string()),
    teamCategory: v.optional(v.union(
      v.literal("founding"),
      v.literal("hub_management"),
      v.literal("staff")
    )),
    isPublicTeamMember: v.optional(v.boolean()),
    joinedAt: v.number(),
    isActive: v.boolean(),
  }).index("by_team_category", ["teamCategory", "isPublicTeamMember"])
    .index("by_email", ["email"]),

  organizationInfo: defineTable({
    key: v.string(), // "vision", "mission", "core_values", "history", "contact_info", etc.
    content: v.string(),
    type: v.union(v.literal("text"), v.literal("html"), v.literal("json")),
    lastUpdatedBy: v.id("users"),
    lastUpdatedAt: v.number(),
  }).index("by_key", ["key"]),

  hubs: defineTable({
    name: v.string(),
    description: v.string(),
    objectives: v.string(),
    termsOfReference: v.optional(v.id("_storage")),
    membershipFormFields: v.array(formFieldSchema), // Embedded form definition
    image: v.optional(v.id("_storage")),
    isActive: v.boolean(),
    createdAt: v.number(),
    createdBy: v.id("users"),
  }),

  hubMemberships: defineTable({
    userId: v.id("users"),
    hubId: v.id("hubs"),
    role: v.union(v.literal("member"), v.literal("lead")),
    applicationData: v.object({}),
    formSnapshot: v.array(formFieldSchema), // Form definition at time of application
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    submittedAt: v.number(),
    reviewedBy: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
    notes: v.optional(v.string()),
  }).index("by_user", ["userId"])
    .index("by_hub", ["hubId"])
    .index("by_status", ["status"])
    .index("by_user_hub", ["userId", "hubId"]),

  partners: defineTable({
    name: v.string(),
    website: v.optional(v.string()),
    logo: v.optional(v.id("_storage")),
    description: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    createdBy: v.id("users"),
  }),

  projects: defineTable({
    title: v.string(),
    description: v.string(),
    location: v.string(),
    coordinates: v.optional(v.object({
      lat: v.number(),
      lng: v.number(),
    })),
    status: v.union(v.literal("ongoing"), v.literal("completed")),
    theme: v.string(),
    hubId: v.id("hubs"),
    partnerIds: v.array(v.id("partners")),
    featuredImage: v.optional(v.id("_storage")),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    isFeatured: v.boolean(),
    isActive: v.boolean(),
    createdAt: v.number(),
    createdBy: v.id("users"),
  }).index("by_hub", ["hubId"])
    .index("by_status", ["status"])
    .index("by_theme", ["theme"])
    .index("by_featured", ["isFeatured"]),

  publications: defineTable({
    title: v.string(),
    content: v.string(),
    type: v.union(
      v.literal("policy_brief"),
      v.literal("article"),
      v.literal("blog_post"),
      v.literal("press_release"),
      v.literal("technical_report")
    ),
    authorId: v.id("users"),
    status: v.union(v.literal("draft"), v.literal("pending"), v.literal("published")),
    publishedAt: v.optional(v.number()),
    featuredImage: v.optional(v.id("_storage")),
    attachments: v.array(v.id("_storage")),
    tags: v.array(v.string()),
    isRestrictedAccess: v.boolean(),
    createdAt: v.number(),
    approvedBy: v.optional(v.id("users")),
  }).index("by_type", ["type"])
    .index("by_status", ["status"])
    .index("by_author", ["authorId"])
    .index("by_published", ["publishedAt"]),

  publicationAccessRequests: defineTable({
    publicationId: v.id("publications"),
    requesterName: v.string(),
    requesterEmail: v.string(),
    requesterOrganization: v.optional(v.string()),
    reason: v.string(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("denied")),
    requestedAt: v.number(),
    reviewedBy: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
  }).index("by_publication", ["publicationId"])
    .index("by_status", ["status"]),

  publicationAccessTokens: defineTable({
    requestId: v.id("publicationAccessRequests"),
    publicationId: v.id("publications"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  }).index("by_token", ["token"])
    .index("by_request", ["requestId"])
    .index("by_expiry", ["expiresAt"]),

  events: defineTable({
    title: v.string(),
    description: v.string(),
    type: v.union(v.literal("event"), v.literal("knowledge_session")),
    startDate: v.number(),
    endDate: v.number(),
    location: v.optional(v.string()),
    isOnline: v.boolean(),
    meetingLink: v.optional(v.string()),
    maxAttendees: v.optional(v.number()),
    registrationRequired: v.boolean(),
    registrationDeadline: v.optional(v.number()),
    featuredImage: v.optional(v.id("_storage")),
    hubId: v.optional(v.id("hubs")),
    isActive: v.boolean(),
    createdAt: v.number(),
    createdBy: v.id("users"),
  }).index("by_start_date", ["startDate"])
    .index("by_type", ["type"]),

  mediaItems: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("image"), v.literal("video")),
    fileId: v.id("_storage"),
    eventId: v.optional(v.id("events")),
    projectId: v.optional(v.id("projects")),
    tags: v.array(v.string()),
    uploadedBy: v.id("users"),
    uploadedAt: v.number(),
    isActive: v.boolean(),
  }).index("by_type", ["type"])
    .index("by_event", ["eventId"])
    .index("by_project", ["projectId"])
    .index("by_uploader", ["uploadedBy"]),

  careerOpportunities: defineTable({
    title: v.string(),
    description: v.string(),
    type: v.union(
      v.literal("job"),
      v.literal("internship"),
      v.literal("fellowship"),
      v.literal("call_for_proposal")
    ),
    requirements: v.string(),
    applicationDeadline: v.number(),
    contactEmail: v.string(),
    applicationLink: v.optional(v.string()),
    attachments: v.array(v.id("_storage")),
    isActive: v.boolean(),
    createdAt: v.number(),
    createdBy: v.id("users"),
  }).index("by_type", ["type"])
    .index("by_deadline", ["applicationDeadline"])
    .index("by_active", ["isActive"]),


  membershipFormConfig: defineTable({
    formFields: v.array(formFieldSchema), // Current form definition
    lastUpdatedBy: v.id("users"),
    lastUpdatedAt: v.number(),
  }),

  membershipApplications: defineTable({
    applicantEmail: v.string(),
    applicantName: v.string(),
    applicationData: v.object({}),
    formSnapshot: v.array(formFieldSchema), // Form definition at time of application
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    submittedAt: v.number(),
    reviewedBy: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
    notes: v.optional(v.string()),
  }).index("by_status", ["status"])
    .index("by_email", ["applicantEmail"]),


  contactFormConfig: defineTable({
    formFields: v.array(formFieldSchema),
    lastUpdatedBy: v.id("users"),
    lastUpdatedAt: v.number(),
  }),

  contactSubmissions: defineTable({
    senderEmail: v.string(),
    senderName: v.string(),
    formData: v.object({}),
    formSnapshot: v.array(formFieldSchema), // Form definition at the time of submission
    status: v.union(v.literal("unread"), v.literal("read"), v.literal("replied")),
    submittedAt: v.number(),
    handledBy: v.optional(v.id("users")),
    handledAt: v.optional(v.number()),
    notes: v.optional(v.string()),
  }).index("by_status", ["status"])
    .index("by_email", ["senderEmail"]),


  formFiles: defineTable({

    submissionId: v.string(),
    submissionType: v.union(v.literal("membership"), v.literal("hub_membership"), v.literal("contact")),

    fieldName: v.string(), // Which form field this file belongs to
    fileName: v.string(),
    fileId: v.id("_storage"),
    fileType: v.string(),
    fileSize: v.number(),
    uploadedAt: v.number(),
  }).index("by_submission", ["submissionId", "submissionType"])
    .index("by_field", ["submissionId", "fieldName"]),

  newsletterSubscriptions: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    isActive: v.boolean(),
    subscribedAt: v.number(),
    unsubscribedAt: v.optional(v.number()),
    preferences: v.optional(v.object({
      events: v.boolean(),
      publications: v.boolean(),
      opportunities: v.boolean(),
    })),
  }).index("by_email", ["email"])
    .index("by_active", ["isActive"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    isRead: v.boolean(),
    relatedId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_read", ["isRead"])
    .index("by_type", ["type"]),
});

export default schema;