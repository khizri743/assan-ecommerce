import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

const protectedRoutes = ["/dashboard", "/admin"];
const authPages = ["/login", "/register"];

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. CRITICAL: Bypass all internal Next.js assets to prevent black screen/freeze
  if (
    path.startsWith("/_next") ||
    path.includes("/api/") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route),
  );
  const isAuthPage = authPages.includes(path);

  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  // 2. Redirect unauthenticated users
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 3. Role-based Guard
  if (path.startsWith("/admin") && session?.role !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // 4. Auth Page Guard (Redirect away if already logged in)
  if (isAuthPage && session?.userId) {
    const destination =
      session.role === "SUPER_ADMIN" ? "/admin/dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(destination, req.nextUrl));
  }

  return NextResponse.next();
}

// 5. Optimized Matcher for Next.js 16
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
