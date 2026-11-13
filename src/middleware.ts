import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require an active authenticated session
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/emis",
  "/family",
  "/notifications",
  "/payment-history",
  "/settings",
  "/install",
];

// Routes reserved for unauthenticated users (redirect to dashboard/emis if already logged in)
const AUTH_PREFIXES = [
  "/login",
  "/register",
  "/forgot-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("myvello_token")?.value;

  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  const isAuthRoute = AUTH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  // If unauthenticated user tries to access any protected account page, redirect immediately to login
  if (isProtectedRoute && !token) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If already authenticated user tries to access login or register, redirect to app
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/emis", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, icons
     */
    "/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|opengraph-image.png).*)",
  ],
};
