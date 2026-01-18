/**
 * Next.js Middleware for Authentication.
 * 
 * This middleware:
 * - Handles Auth0 authentication flow routes (/auth/*) via SDK v4
 * - Protects dashboard routes - redirects to login if not authenticated
 * - Passes through public routes
 * 
 * Auth0 SDK v4 uses middleware to handle auth routes automatically.
 * Routes are /auth/login, /auth/logout, /auth/callback (no /api prefix).
 */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth0, isAuth0Configured, getAuth0Client } from '@/lib/auth0';

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/clients', '/metrics', '/settings'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ==========================================================================
    // Skip if Auth0 is not configured (development mode)
    // ==========================================================================
    if (!isAuth0Configured()) {
        // Allow all requests through when Auth0 is not configured
        // This enables development without Auth0 setup
        return NextResponse.next();
    }

    // ==========================================================================
    // Let Auth0 handle all /auth/* routes (login, logout, callback)
    // The SDK middleware handles token exchange and session creation
    // ==========================================================================
    const authResponse = await getAuth0Client().middleware(request);
    if (authResponse) {
        // Auth0 handled this request (auth routes like /auth/login, /auth/callback)
        return authResponse;
    }

    // ==========================================================================
    // Check if route requires authentication
    // ==========================================================================
    const isProtectedRoute = PROTECTED_ROUTES.some(route =>
        pathname.startsWith(route)
    );

    if (isProtectedRoute) {
        try {
            const session = await auth0.getSession(request);

            if (!session) {
                // User not authenticated - redirect to login
                // Using /auth/login (not /api/auth/login) per SDK v4
                const loginUrl = new URL('/auth/login', request.url);
                loginUrl.searchParams.set('returnTo', pathname);
                return NextResponse.redirect(loginUrl);
            }
        } catch {
            // Session error - redirect to login
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    // ==========================================================================
    // Allow request to continue
    // ==========================================================================
    return NextResponse.next();
}

// =============================================================================
// MIDDLEWARE CONFIG
// =============================================================================

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         * - Static assets (svg, png, jpg, etc.)
         */
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
