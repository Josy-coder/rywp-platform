import { NextRequest, NextResponse } from "next/server";

interface UserData {
  id: string;
  email: string;
  globalRole: "member" | "admin" | "superadmin";
  isGlobalAdmin: boolean;
  isSuperAdmin: boolean;
  hasTemporaryAdmin: boolean;
  hubMemberships: Array<{
    hubId: string;
    role: "member" | "lead";
    hubName: string;
  }>;
}

function createRouteMatcher(patterns: string[]) {
  return (request: NextRequest) => {
    const { pathname } = request.nextUrl;
    return patterns.some((pattern) => {
      if (pattern.endsWith("(.*)")) {
        const basePattern = pattern.replace("(.*)", "");
        return pathname.startsWith(basePattern);
      }
      return pathname === pattern || pathname === pattern + "/";
    });
  };
}

const isComingSoonPage = createRouteMatcher(["/coming-soon"]);

const isSignInPage = createRouteMatcher(["/signin"]);
const isForgotPasswordPage = createRouteMatcher([
  "/forgot-password",
  "/reset-password",
]);

const isProtectedRoute = createRouteMatcher([
  "/dashboard",
  "/dashboard/(.*)",
  "/member-portal",
  "/member-portal/(.*)",
  "/admin",
  "/admin/(.*)",
]);

const isAdminRoute = createRouteMatcher([
  "/dashboard",
  "/dashboard/(.*)",
  "/admin",
  "/admin/(.*)",
]);

const isSuperAdminRoute = createRouteMatcher([
  "/dashboard/super-admin",
  "/dashboard/super-admin/(.*)",
]);

const isPublicRoute = createRouteMatcher([
  "/",
  "/home",
  "/about",
  "/hubs",
  "/projects",
  "/publications",
  "/events",
  "/membership",
  "/partners",
  "/careers",
  "/contact",
  "/privacy-policy",
  "/terms-of-service",
  "/cookie-policy",
  "/sitemap",
]);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if coming soon mode is enabled via environment variable
  // Set NEXT_PUBLIC_COMING_SOON=true to enable the coming soon page
  // Set NEXT_PUBLIC_COMING_SOON=false (or leave unset) to show the full website
  const comingSoonEnabled = process.env.NEXT_PUBLIC_COMING_SOON === "true";

  if (comingSoonEnabled && !isComingSoonPage(request)) {
    return NextResponse.redirect(new URL("/coming-soon", request.url));
  }

  // If coming soon is disabled and user visits /coming-soon, allow it (for testing)
  if (!comingSoonEnabled && isComingSoonPage(request)) {
    return NextResponse.next();
  }

  function redirectTo(url: string) {
    return NextResponse.redirect(new URL(url, request.url));
  }

  function getUserFromCookies(): UserData | null {
    try {
      const userDataCookie = request.cookies.get("user_data")?.value;
      if (!userDataCookie) return null;

      return JSON.parse(userDataCookie) as UserData;
    } catch (error) {
      console.error("Error parsing user data cookie:", error);
      return null;
    }
  }

  function isAuthenticated(): boolean {
    const authToken = request.cookies.get("auth_token")?.value;
    const userData = getUserFromCookies();
    return !!(authToken && userData);
  }

  // Rest of the middleware logic (only runs in development due to production redirect above)
  const user = getUserFromCookies();
  const authenticated = isAuthenticated();

  if (isSignInPage(request) || isForgotPasswordPage(request)) {
    if (authenticated && user) {
      if (user.isGlobalAdmin) {
        return redirectTo("/dashboard");
      } else {
        return redirectTo("/member-portal");
      }
    }
    return NextResponse.next();
  }

  if (isProtectedRoute(request)) {
    if (!authenticated) {
      const response = redirectTo("/signin");
      response.cookies.set("intended_destination", pathname, {
        maxAge: 60 * 10, // 10 minutes
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return response;
    }

    if (isAdminRoute(request) && !user?.isGlobalAdmin) {
      return redirectTo("/member-portal"); // Redirect non-admins to member portal
    }

    if (isSuperAdminRoute(request) && !user?.isSuperAdmin) {
      return redirectTo("/dashboard"); // Redirect non-superadmins to regular dashboard
    }

    return NextResponse.next();
  }

  if (isPublicRoute(request) || !isProtectedRoute(request)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
