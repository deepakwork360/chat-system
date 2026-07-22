import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Note: HttpOnly cookies set by a cross-site backend API (e.g. b4a.run)
    // are stored for the API domain and are not accessible by Next.js server middleware.
    // Client-side authentication checks in components (e.g. getProfile() in /chat) handle auth verification.
    return NextResponse.next();
}

// Config to specify which paths this middleware should run on
export const config = {
    matcher: ["/", "/login", "/register", "/chat/:path*"],
};
