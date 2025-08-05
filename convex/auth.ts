import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { QueryCtx, MutationCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";

const JWT_EXPIRES_IN = 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME = 30 * 60 * 1000;

function generateSalt(): string {
  const saltArray = new Uint8Array(32);
  crypto.getRandomValues(saltArray);
  return Array.from(saltArray, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const actualSalt = salt || generateSalt();
  const encoder = new TextEncoder();

  const passwordBuffer = encoder.encode(password);
  const saltBuffer = encoder.encode(actualSalt);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const iterations = 100_000;
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const hashArray = new Uint8Array(derivedBits);
  const hash = btoa(Array.from(hashArray, ch => String.fromCharCode(ch)).join(''));

  return { hash, salt: actualSalt };
}

async function verifyPassword(password: string, storedHash: string, storedSalt: string): Promise<boolean> {
  try {
    const { hash } = await hashPassword(password, storedSalt);
    return hash === storedHash;
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}

async function generateSecureToken(payload: any, expiresIn: number): Promise<string> {
  const header = {
    alg: "HS256",
    typ: "JWT"
  };

  const now = Date.now();
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
    iss: "RYWP",
    aud: "RYWP-users"
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(tokenPayload));

  const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
  );

  const byteArray = new Uint8Array(signature);
  let binary = '';
  for (let i = 0; i < byteArray.length; i++) {
    binary += String.fromCharCode(byteArray[i]);
  }
  const encodedSignature = btoa(binary);

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

async function verifySecureToken(token: string): Promise<any> {
  try {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');

    if (!encodedHeader || !encodedPayload || !encodedSignature) {
      throw new Error('Invalid token format');
    }

    const secret = process.env.JWT_SECRET!;
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signature = new Uint8Array(
      atob(encodedSignature).split('').map(char => char.charCodeAt(0))
    );

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
    );

    if (!isValid) {
      throw new Error('Invalid token signature');
    }

    const payload = JSON.parse(atob(encodedPayload));

    if (payload.exp && Date.now() > payload.exp) {
      throw new Error('Token expired');
    }

    if (payload.iss !== 'RYWP' || payload.aud !== 'RYWP-users') {
      throw new Error('Invalid token claims');
    }

    return payload;
  } catch (error: any) {
    throw new Error(`Token verification failed: ${error.message}`);
  }
}

function generateRandomToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

async function generateTokens(userId: string) {
  const accessToken = await generateSecureToken({ userId }, JWT_EXPIRES_IN);
  const refreshToken = await generateSecureToken({ userId, type: 'refresh' }, REFRESH_TOKEN_EXPIRES_IN);

  return { accessToken, refreshToken };
}

export async function getUserFromToken(ctx: QueryCtx | MutationCtx, token: string): Promise<Doc<"users"> | null> {
  try {
    const decoded = await verifySecureToken(token);
    if (!decoded || !decoded.userId) {
      return null;
    }

    const user = await ctx.db.get(decoded.userId as Id<"users">);
    if (!user || !user.isActive) {
      return null;
    }

    return user;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
}

export async function getPermissions(ctx: QueryCtx | MutationCtx, token: string) {
  const user = await getUserFromToken(ctx, token);
  if (!user) return null;

  const hubMemberships = await ctx.db
    .query("hubMemberships")
    .withIndex("by_user", (q) => q.eq("userId", user._id as Id<"users">))
    .filter((q) => q.eq(q.field("status"), "approved"))
    .collect();

  return {
    user,
    hubMemberships,
    isGlobalAdmin: () => {
      return user.globalRole === "admin" ||
        user.globalRole === "superadmin" ||
        (user.temporaryAdminUntil && user.temporaryAdminUntil > Date.now());
    },
    isSuperAdmin: () => user.globalRole === "superadmin",
    isHubLead: (hubId: string) => hubMemberships.some(m => m.hubId === hubId && m.role === "lead"),
    isMemberOfHub: (hubId: string) => hubMemberships.some(m => m.hubId === hubId),
    canManageHub: (hubId: string) => {
      return user.globalRole === "admin" ||
        user.globalRole === "superadmin" ||
        (user.temporaryAdminUntil && user.temporaryAdminUntil > Date.now()) ||
        hubMemberships.some(m => m.hubId === hubId && m.role === "lead");
    }
  };
}

export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    deviceInfo: v.optional(v.object({
      userAgent: v.optional(v.string()),
      ipAddress: v.optional(v.string()),
      platform: v.optional(v.string()),
    })),
  },
  handler: async (ctx, { email, password, deviceInfo }) => {
    try {

      const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();

      if (!user) {
        return { error: "Invalid email or password" };
      }

      if (user.lockedUntil && user.lockedUntil > Date.now()) {
        const lockTimeRemaining = Math.ceil((user.lockedUntil - Date.now()) / (1000 * 60));
        return { error: `Account is locked. Try again in ${lockTimeRemaining} minutes.` };
      }

      if (!user.isActive) {
        return { error: "Account has been deactivated. Please contact an administrator." };
      }

      const [storedHash, storedSalt] = user.password.split(':');
      if (!storedHash || !storedSalt) {
        return { error: "Invalid account configuration. Please contact support." };
      }

      const isValidPassword = await verifyPassword(password, storedHash, storedSalt);

      if (!isValidPassword) {

        const newFailedAttempts = user.failedLoginAttempts + 1;
        const updates: any = { failedLoginAttempts: newFailedAttempts };

        if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
          updates.lockedUntil = Date.now() + LOCK_TIME;
        }

        await ctx.db.patch(user._id, updates);

        if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
          return { error: "Account has been locked due to too many failed attempts. Please reset your password." };
        }

        return { error: "Invalid email or password" };
      }

      await ctx.db.patch(user._id, {
        failedLoginAttempts: 0,
        lockedUntil: undefined,
        lastLoginAt: Date.now(),
        emailVerified: true,
      });

      const { accessToken, refreshToken } = await generateTokens(user._id);

      await ctx.db.insert("authSessions", {
        userId: user._id,
        sessionToken: accessToken,
        refreshToken,
        deviceInfo,
        expiresAt: Date.now() + JWT_EXPIRES_IN,
        refreshExpiresAt: Date.now() + REFRESH_TOKEN_EXPIRES_IN,
        lastUsedAt: Date.now(),
        createdAt: Date.now(),
      });

      const hubMemberships = await ctx.db
        .query("hubMemberships")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .filter((q) => q.eq(q.field("status"), "approved"))
        .collect();

      const enrichedMemberships = await Promise.all(
        hubMemberships.map(async (membership) => {
          const hub = await ctx.db.get(membership.hubId);
          return { ...membership, hub };
        })
      );

      return {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          globalRole: user.globalRole,
          profileImage: user.profileImage,
          bio: user.bio,
          position: user.position,
          emailVerified: user.emailVerified,
          joinedAt: user.joinedAt,
          hubMemberships: enrichedMemberships,
          isGlobalAdmin: user.globalRole === "admin" ||
            user.globalRole === "superadmin" ||
            (user.temporaryAdminUntil && user.temporaryAdminUntil > Date.now()),
          isSuperAdmin: user.globalRole === "superadmin",
          hasTemporaryAdmin: user.temporaryAdminUntil && user.temporaryAdminUntil > Date.now(),
        },
        tokens: {
          accessToken,
          refreshToken,
        }
      };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error: "Failed to sign in. Please try again." };
    }
  },
});


export const getCurrentUser = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    try {
      const user = await getUserFromToken(ctx, token);
      if (!user) {
        return { error: "Invalid or expired token" };
      }

      const session = await ctx.db
        .query("authSessions")
        .withIndex("by_session_token", (q) => q.eq("sessionToken", token))
        .first();

      if (!session || session.expiresAt < Date.now()) {
        return { error: "Session expired" };
      }

      const hubMemberships = await ctx.db
        .query("hubMemberships")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .filter((q) => q.eq(q.field("status"), "approved"))
        .collect();

      const enrichedMemberships = await Promise.all(
        hubMemberships.map(async (membership) => {
          const hub = await ctx.db.get(membership.hubId);
          return { ...membership, hub };
        })
      );

      return {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          globalRole: user.globalRole,
          profileImage: user.profileImage,
          bio: user.bio,
          position: user.position,
          emailVerified: user.emailVerified,
          joinedAt: user.joinedAt,
          hubMemberships: enrichedMemberships,
          isGlobalAdmin: user.globalRole === "admin" ||
            user.globalRole === "superadmin" ||
            (user.temporaryAdminUntil && user.temporaryAdminUntil > Date.now()),
          isSuperAdmin: user.globalRole === "superadmin",
          hasTemporaryAdmin: user.temporaryAdminUntil && user.temporaryAdminUntil > Date.now(),
        }
      };
    } catch (error) {
      console.error("Get current user error:", error);
      return { error: "Failed to get user data" };
    }
  },
});

export const refreshToken = mutation({
  args: { refreshToken: v.string() },
  handler: async (ctx, { refreshToken }) => {
    try {
      const decoded = await verifySecureToken(refreshToken);
      if (!decoded || !decoded.userId || decoded.type !== 'refresh') {
        return { error: "Invalid refresh token" };
      }

      const session = await ctx.db
        .query("authSessions")
        .withIndex("by_refresh_token", (q) => q.eq("refreshToken", refreshToken))
        .first();

      if (!session || session.refreshExpiresAt < Date.now()) {
        return { error: "Refresh token expired" };
      }

      const user = await ctx.db.get(session.userId);
      if (!user || !user.isActive) {
        return { error: "User not found or inactive" };
      }

      const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user._id);

      await ctx.db.patch(session._id, {
        sessionToken: accessToken,
        refreshToken: newRefreshToken,
        expiresAt: Date.now() + JWT_EXPIRES_IN,
        refreshExpiresAt: Date.now() + REFRESH_TOKEN_EXPIRES_IN,
        lastUsedAt: Date.now(),
      });

      return {
        success: true,
        tokens: {
          accessToken,
          refreshToken: newRefreshToken,
        }
      };
    } catch (error) {
      console.error("Refresh token error:", error);
      return { error: "Failed to refresh token" };
    }
  },
});

export const signOut = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    try {

      const session = await ctx.db
        .query("authSessions")
        .withIndex("by_session_token", (q) => q.eq("sessionToken", token))
        .first();

      if (session) {
        await ctx.db.delete(session._id);
      }

      return { success: true };
    } catch (error) {
      console.error("Sign out error:", error);
      return { error: "Failed to sign out" };
    }
  },
});

export const requestPasswordReset = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    try {
      const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();

      if (!user) {

        return { success: true, message: "If an account with this email exists, you will receive a password reset link." };
      }

      const resetToken = generateRandomToken();
      const expiresAt = Date.now() + (30 * 60 * 1000); // 30 minutes

      const existingTokens = await ctx.db
        .query("passwordResetTokens")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();

      for (const token of existingTokens) {
        await ctx.db.delete(token._id);
      }

      await ctx.db.insert("passwordResetTokens", {
        userId: user._id,
        token: resetToken,
        expiresAt,
        createdAt: Date.now(),
      });

      await ctx.scheduler.runAfter(0, internal.emails.sendPasswordResetEmail, {
        to: user.email,
        name: user.name,
        resetToken,
      });

      return { success: true, message: "If an account with this email exists, you will receive a password reset link." };
    } catch (error) {
      console.error("Request password reset error:", error);
      return { error: "Failed to process password reset request" };
    }
  },
});

export const resetPassword = mutation({
  args: {
    token: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, { token, newPassword }) => {
    try {

      const resetToken = await ctx.db
        .query("passwordResetTokens")
        .withIndex("by_token", (q) => q.eq("token", token))
        .first();

      if (!resetToken || resetToken.usedAt || resetToken.expiresAt < Date.now()) {
        return { error: "Invalid or expired reset token" };
      }

      const { hash, salt } = await hashPassword(newPassword);
      const hashedPassword = `${hash}:${salt}`;

      await ctx.db.patch(resetToken.userId, {
        password: hashedPassword,
        failedLoginAttempts: 0,
        lockedUntil: undefined,
      });

      await ctx.db.patch(resetToken._id, {
        usedAt: Date.now(),
      });

      const sessions = await ctx.db
        .query("authSessions")
        .withIndex("by_user", (q) => q.eq("userId", resetToken.userId))
        .collect();

      for (const session of sessions) {
        await ctx.db.delete(session._id);
      }

      return { success: true, message: "Password reset successfully. Please sign in with your new password." };
    } catch (error) {
      console.error("Reset password error:", error);
      return { error: "Failed to reset password" };
    }
  },
});

export const createAdminUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    globalRole: v.union(v.literal("admin"), v.literal("superadmin")),
    temporaryAdminUntil: v.optional(v.number()),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const currentUser = await getUserFromToken(ctx, args.token);
      if (!currentUser || currentUser.globalRole !== "superadmin") {
        return { error: "Only superadmins can create admin users" };
      }

      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();

      if (existingUser) {
        return { error: "User with this email already exists" };
      }

      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const { hash, salt } = await hashPassword(tempPassword);
      const hashedPassword = `${hash}:${salt}`;

      const userId = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        phone: args.phone,
        password: hashedPassword,
        emailVerified: false,
        globalRole: args.globalRole,
        temporaryAdminUntil: args.temporaryAdminUntil,
        isActive: true,
        joinedAt: Date.now(),
        failedLoginAttempts: 0,
      });

      await ctx.scheduler.runAfter(0, internal.emails.sendAdminWelcomeEmail, {
        to: args.email,
        name: args.name,
        temporaryPassword: tempPassword,
        role: args.globalRole,
      });

      return { success: true, userId, message: "Admin user created successfully. Welcome email sent with temporary password." };
    } catch (error) {
      console.error("Failed to create admin user:", error);
      return { error: "Failed to create admin user" };
    }
  },
});

export const createSuperAdmin = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    superAdminKey: v.string(),
  },
  handler: async (ctx, { email, name, phone, superAdminKey }) => {
    try {

      const validKey = process.env.SUPER_ADMIN_KEY;
      if (!validKey || superAdminKey !== validKey) {
        return { error: "Invalid super admin key" };
      }

      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();

      if (existingUser) {
        return { error: "User with this email already exists" };
      }

      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const { hash, salt } = await hashPassword(tempPassword);
      const hashedPassword = `${hash}:${salt}`;

      const userId = await ctx.db.insert("users", {
        name,
        email,
        phone,
        password: hashedPassword,
        emailVerified: false,
        globalRole: "superadmin",
        isActive: true,
        joinedAt: Date.now(),
        failedLoginAttempts: 0,
      });

      await ctx.scheduler.runAfter(0, internal.emails.sendAdminWelcomeEmail, {
        to: email,
        name,
        temporaryPassword: tempPassword,
        role: "superadmin",
      });

      return {
        success: true,
        userId,
        temporaryPassword: tempPassword,
        message: "Super admin user created successfully. Welcome email sent with temporary password."
      };
    } catch (error) {
      console.error("Failed to create super admin user:", error);
      return { error: "Failed to create super admin user" };
    }
  },
});

export const grantTemporaryAdminAccess = mutation({
  args: {
    userId: v.id("users"),
    temporaryAdminUntil: v.number(),
    token: v.string(),
  },
  handler: async (ctx, { userId, temporaryAdminUntil, token }) => {
    try {
      const permissions = await getPermissions(ctx, token);
      if (!permissions?.isGlobalAdmin()) {
        return { error: "Insufficient permissions" };
      }

      const targetUser = await ctx.db.get(userId);
      if (!targetUser) {
        return { error: "User not found" };
      }

      await ctx.db.patch(userId, {
        temporaryAdminUntil,
      });

      await ctx.scheduler.runAfter(0, internal.emails.sendTemporaryAdminAccessEmail, {
        to: targetUser.email,
        name: targetUser.name,
        expiresAt: temporaryAdminUntil,
      });

      return { success: true, message: "Temporary admin access granted successfully." };
    } catch (error) {
      console.error("Failed to grant temporary admin access:", error);
      return { error: "Failed to grant temporary admin access" };
    }
  },
});

export const revokeTemporaryAdminAccess = mutation({
  args: {
    userId: v.id("users"),
    token: v.string(),
  },
  handler: async (ctx, { userId, token }) => {
    try {
      const permissions = await getPermissions(ctx, token);
      if (!permissions?.isGlobalAdmin()) {
        return { error: "Insufficient permissions" };
      }

      await ctx.db.patch(userId, {
        temporaryAdminUntil: undefined,
      });

      return { success: true, message: "Temporary admin access revoked successfully." };
    } catch (error) {
      console.error("Failed to revoke temporary admin access:", error);
      return { error: "Failed to revoke temporary admin access" };
    }
  },
});

export const cleanupExpiredAuthData = internalMutation(async (ctx) => {
  const now = Date.now();
  let deletedCount = 0;

  try {

    const expiredSessions = await ctx.db
      .query("authSessions")
      .withIndex("by_expires_at", (q) => q.lt("expiresAt", now))
      .collect();

    for (const session of expiredSessions) {
      await ctx.db.delete(session._id);
      deletedCount++;
    }

    const expiredRefreshSessions = await ctx.db
      .query("authSessions")
      .filter((q) => q.lt(q.field("refreshExpiresAt"), now))
      .collect();

    for (const session of expiredRefreshSessions) {
      await ctx.db.delete(session._id);
      deletedCount++;
    }

    const expiredResetTokens = await ctx.db
      .query("passwordResetTokens")
      .withIndex("by_expires_at", (q) => q.lt("expiresAt", now))
      .collect();

    for (const token of expiredResetTokens) {
      await ctx.db.delete(token._id);
      deletedCount++;
    }

    const oldUsedTokens = await ctx.db
      .query("passwordResetTokens")
      .filter((q) => q.neq(q.field("usedAt"), undefined))
      .filter((q) => q.lt(q.field("usedAt"), now - (24 * 60 * 60 * 1000)))
      .collect();

    for (const token of oldUsedTokens) {
      await ctx.db.delete(token._id);
      deletedCount++;
    }

    console.log(`Auth cleanup completed. Deleted ${deletedCount} expired records.`);
    return { success: true, deletedCount };
  } catch (error) {
    console.error("Auth cleanup failed:", error);
    return { success: false, error: "Cleanup failed" };
  }
});