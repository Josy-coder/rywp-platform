"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  globalRole: "member" | "admin" | "superadmin";
  profileImage?: string;
  bio?: string;
  position?: string;
  emailVerified: boolean;
  joinedAt: number;
  hubMemberships: Array<{
    hubId: string;
    role: "member" | "lead";
    hub: {
      name: string;
      _id: string;
    } | null;
  }>;
  isGlobalAdmin: boolean;
  isSuperAdmin: boolean;
  hasTemporaryAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success?: boolean; error?: string }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success?: boolean; error?: string; message?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success?: boolean; error?: string; message?: string }>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setAuthCookies(accessToken: string, refreshToken: string, user: User): void {
  if (typeof window === 'undefined') return;

  fetch('/api/auth/set-cookies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessToken,
      refreshToken,
      user,
    }),
  }).catch(console.error);
}

function clearAuthCookies(): void {
  if (typeof window === 'undefined') return;

  fetch('/api/auth/clear-cookies', {
    method: 'POST',
  }).catch(console.error);
}

async function getCurrentAuthState(): Promise<{ user: User | null; token: string | null }> {
  try {
    const response = await fetch('/api/auth/current-user', {
      credentials: 'include', // Include cookies
    });

    if (response.ok) {
      const data = await response.json();
      return {
        user: data.user || null,
        token: data.token || null,
      };
    }
  } catch (error) {
    console.error('Error getting current auth state:', error);
  }

  return { user: null, token: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentToken, setCurrentToken] = useState<string | null>(null);

  const router = useRouter();

  const signInMutation = useMutation(api.auth.signIn);
  const signOutMutation = useMutation(api.auth.signOut);
  const refreshTokenMutation = useMutation(api.auth.refreshToken);
  const requestPasswordResetMutation = useMutation(api.auth.requestPasswordReset);
  const resetPasswordMutation = useMutation(api.auth.resetPassword);

  const currentUserQuery = useQuery(
    api.auth.getCurrentUser,
    currentToken ? { token: currentToken } : "skip"
  );

  useEffect(() => {
    const initializeAuth = async () => {
      const { user: savedUser, token } = await getCurrentAuthState();
      if (savedUser && token) {
        setUser(savedUser);
        setCurrentToken(token);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (currentUserQuery !== undefined) {
      if (currentUserQuery.success && currentUserQuery.user) {
        const currentUser: User = {
          ...currentUserQuery.user,
          isGlobalAdmin: Boolean(currentUserQuery.user.isGlobalAdmin),
          isSuperAdmin: Boolean(currentUserQuery.user.isSuperAdmin),
          hasTemporaryAdmin: Boolean(currentUserQuery.user.hasTemporaryAdmin),
        };

        setUser(currentUser);

        if (currentToken) {
          fetch('/api/auth/refresh-user-data', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user: currentUser }),
          }).catch(console.error);
        }
      } else if (currentUserQuery.error) {
        handleTokenRefresh();
      }
    }
  }, [currentUserQuery, currentToken]);

  useEffect(() => {
    if (!currentToken) return;

    const refreshInterval = setInterval(async () => {
      await handleTokenRefresh();
    }, 55 * 60 * 1000); // 55 minutes

    return () => clearInterval(refreshInterval);
  }, [currentToken]);

  const handleTokenRefresh = async () => {
    try {

      const response = await fetch('/api/auth/get-refresh-token', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('No refresh token available');
      }

      const { refreshToken } = await response.json();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const result = await refreshTokenMutation({ refreshToken });

      if (result.success && result.tokens) {
        setCurrentToken(result.tokens.accessToken);

        if (user) {
          setAuthCookies(result.tokens.accessToken, result.tokens.refreshToken, user);
        }
      } else {

        await handleAuthClear();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      await handleAuthClear();
    }
  };

  const handleAuthClear = async () => {
    setUser(null);
    setCurrentToken(null);
    clearAuthCookies();

    if (window.location.pathname.startsWith('/dashboard') ||
      window.location.pathname.startsWith('/member-portal') ||
      window.location.pathname.startsWith('/admin')) {
      router.push('/signin');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInMutation({
        email,
        password,
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
        }
      });

      if (result.success && result.tokens) {
        const currentUser: User = {
          ...result.user,
          isGlobalAdmin: Boolean(result.user.isGlobalAdmin),
          isSuperAdmin: Boolean(result.user.isSuperAdmin),
          hasTemporaryAdmin: Boolean(result.user.hasTemporaryAdmin),
        };

        setCurrentToken(result.tokens.accessToken);
        setUser(currentUser);

        setAuthCookies(result.tokens.accessToken, result.tokens.refreshToken, currentUser);

        const response = await fetch('/api/auth/get-intended-destination', {
          credentials: 'include',
        });

        let intendedDestination = null;
        if (response.ok) {
          const data = await response.json();
          intendedDestination = data.destination;
        }

        if (intendedDestination) {
          router.push(intendedDestination);
        } else if (result.user.isGlobalAdmin) {
          router.push('/dashboard');
        } else {
          router.push('/member-portal');
        }

        return { success: true };
      } else {
        return { error: result.error || 'Sign in failed' };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      if (currentToken) {
        await signOutMutation({ token: currentToken });
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setUser(null);
      setCurrentToken(null);
      clearAuthCookies();
      router.push('/');
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const result = await requestPasswordResetMutation({ email });
      return result;
    } catch (error) {
      console.error('Password reset request error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const result = await resetPasswordMutation({ token, newPassword });
      return result;
    } catch (error) {
      console.error('Password reset error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const refreshAuth = async () => {
    await handleTokenRefresh();
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signOut,
    requestPasswordReset,
    resetPassword,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}