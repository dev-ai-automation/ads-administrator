/**
 * Auth0 Authentication Route Handler.
 * 
 * This dynamic route handles all Auth0 authentication flows using middleware:
 * - GET /api/auth/login - Initiate login
 * - GET /api/auth/logout - Logout user
 * - GET /api/auth/callback - Auth0 callback after login
 * - GET /api/auth/me - Get current user session
 * 
 * Uses the Auth0 Next.js SDK's built-in middleware handler.
 * 
 * @see https://github.com/auth0/nextjs-auth0/blob/main/V4_MIGRATION_GUIDE.md
 */
import { auth0 } from '@/lib/auth0';
import { NextRequest } from 'next/server';

// The middleware handler automatically handles all auth routes
export const GET = (req: NextRequest) => auth0.middleware(req);
