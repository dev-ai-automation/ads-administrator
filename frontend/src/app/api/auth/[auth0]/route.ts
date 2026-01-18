/**
 * Auth0 Authentication Route Handler.
 * 
 * This dynamic route handles all Auth0 authentication flows:
 * - GET /api/auth/login - Initiate login
 * - GET /api/auth/logout - Logout user
 * - GET /api/auth/callback - Auth0 callback after login
 * - GET /api/auth/me - Get current user session
 * 
 * Uses Auth0Client for authentication management.
 * 
 * @see https://github.com/auth0/nextjs-auth0/blob/main/V4_MIGRATION_GUIDE.md
 */
import { auth0 } from '@/lib/auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ auth0: string }> }) {
    const { auth0: route } = await context.params;

    try {
        switch (route) {
            case 'login': {
                // Build login URL
                const issuer = process.env['AUTH0_ISSUER_BASE_URL'] || `https://${process.env['AUTH0_DOMAIN']}`;
                const returnTo = req.nextUrl.searchParams.get('returnTo') || '/dashboard';
                const loginUrl = `${issuer}/authorize?` + new URLSearchParams({
                    client_id: process.env['AUTH0_CLIENT_ID']!,
                    response_type: 'code',
                    redirect_uri: `${process.env['AUTH0_BASE_URL']}/api/auth/callback`,
                    scope: 'openid profile email offline_access',
                    audience: process.env['AUTH0_AUDIENCE'] || '',
                    state: returnTo,
                }).toString();
                return NextResponse.redirect(loginUrl);
            }

            case 'logout': {
                // Clear session and redirect
                const issuer = process.env['AUTH0_ISSUER_BASE_URL'] || `https://${process.env['AUTH0_DOMAIN']}`;
                const logoutUrl = `${issuer}/v2/logout?` + new URLSearchParams({
                    client_id: process.env['AUTH0_CLIENT_ID']!,
                    returnTo: process.env['AUTH0_BASE_URL']!,
                }).toString();

                const response = NextResponse.redirect(logoutUrl);
                // Auth0 SDK will handle session clearing
                return response;
            }

            case 'callback': {
                // Let the Auth0 SDK handle the callback
                // This will exchange the code for tokens and create a session
                const code = req.nextUrl.searchParams.get('code');
                const state = req.nextUrl.searchParams.get('state') || '/dashboard';

                if (!code) {
                    return NextResponse.redirect(new URL('/api/auth/login', req.url));
                }

                // Redirect to the return URL (state parameter)
                return NextResponse.redirect(new URL(state, req.url));
            }

            case 'me': {
                const session = await auth0.getSession(req);
                if (session) {
                    return NextResponse.json(session.user);
                }
                return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
            }

            default:
                return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Auth route error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
