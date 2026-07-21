import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Retrieve the 'token' cookie from the request
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    // Define paths that are public auth pages
    const isAuthPage = pathname === "/login" || pathname === "/register";

    // Define paths that require authentication
    const isProtectedRoute = pathname.startsWith("/chat");

    if (token) {
        // If user is logged in, redirect them to /chat if they try to access login/register/root
        if (isAuthPage || pathname === "/") {
            return NextResponse.redirect(new URL("/chat", request.url));
        }
    } else {
        // If user is not logged in, redirect them to /login if they try to access protected routes
        if (isProtectedRoute) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

// Config to specify which paths this middleware should run on
export const config = {
    matcher: ["/", "/login", "/register", "/chat/:path*"],
};
