/**
 * Next.js Middleware for Authentication.
 * 
 * This middleware:
 * - Handles Auth0 authentication flow routes (/auth/*)
 * - Protects dashboard routes - redirects to login if not authenticated
 * - Passes through public routes
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth0, isAuth0Configured } from '@/lib/auth0';

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
                const loginUrl = new URL('/api/auth/login', request.url);
                loginUrl.searchParams.set('returnTo', pathname);
                return NextResponse.redirect(loginUrl);
            }
        } catch {
            // Session error - redirect to login
            return NextResponse.redirect(new URL('/api/auth/login', request.url));
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
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico (favicon)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
