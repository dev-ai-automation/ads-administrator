/**
 * Legacy API Auth Route - Redirect to new /auth/* routes.
 *
 * This catch-all route provides backward compatibility for Auth0 callbacks
 * that are still configured to use /api/auth/* (v3 pattern).
 *
 * Auth0 SDK v4 uses /auth/* routes instead of /api/auth/*.
 * This route redirects legacy calls to the new endpoints.
 *
 * Routes handled:
 * - /api/auth/login    → /auth/login
 * - /api/auth/logout   → /auth/logout
 * - /api/auth/callback → /auth/callback
 */
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ auth0: string[] }> }
) {
  const { auth0: pathSegments } = await context.params;
  const authPath = pathSegments.join('/');

  // Preserve query parameters (important for callback code/state)
  const searchParams = request.nextUrl.searchParams.toString();
  const queryString = searchParams ? `?${searchParams}` : '';

  // Redirect to the new /auth/* route
  const newUrl = new URL(`/auth/${authPath}${queryString}`, request.url);

  return NextResponse.redirect(newUrl, { status: 307 });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ auth0: string[] }> }
) {
  // Handle POST requests the same way (for potential form submissions)
  return GET(request, context);
}
