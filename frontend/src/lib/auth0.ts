/**
 * Auth0 SDK Configuration.
 * 
 * This file configures the Auth0 Next.js SDK (v4.x) for App Router.
 * Uses environment variables for all sensitive settings.
 * 
 * See: https://github.com/auth0/nextjs-auth0/blob/main/V4_MIGRATION_GUIDE.md
 */
import { Auth0Client } from '@auth0/nextjs-auth0/server';

// =============================================================================
// AUTH0 CLIENT CONFIGURATION
// =============================================================================

/**
 * Auth0 client instance for server-side authentication.
 * 
 * The SDK is configured via environment variables:
 * - AUTH0_SECRET: Long random string to encrypt session cookie
 * - AUTH0_BASE_URL: The base URL of your application
 * - AUTH0_ISSUER_BASE_URL: Your Auth0 tenant domain
 * - AUTH0_CLIENT_ID: Your Auth0 application client ID
 * - AUTH0_CLIENT_SECRET: Your Auth0 application client secret
 * - AUTH0_AUDIENCE: API audience for access tokens (optional)
 * 
 * These are automatically picked up by the SDK.
 */
export const auth0 = new Auth0Client();

// =============================================================================
// HELPER EXPORTS
// =============================================================================

/**
 * Type for the Auth0 session user.
 */
export interface SessionUser {
    sub: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
    nickname?: string;
    picture?: string;
}

/**
 * Get the current user session (server-side only).
 * Returns null if not authenticated.
 */
export async function getSession() {
    try {
        return await auth0.getSession();
    } catch {
        return null;
    }
}

/**
 * Get the access token for API calls (server-side only).
 * Throws if not authenticated or token cannot be obtained.
 */
export async function getAccessToken(): Promise<string> {
    const tokenResult = await auth0.getAccessToken();
    if (!tokenResult?.token) {
        throw new Error('No access token available');
    }
    return tokenResult.token;
}

/**
 * Check if Auth0 is configured (environment variables are set).
 */
export function isAuth0Configured(): boolean {
    const required = ['AUTH0_SECRET', 'AUTH0_BASE_URL', 'AUTH0_ISSUER_BASE_URL', 'AUTH0_CLIENT_ID', 'AUTH0_CLIENT_SECRET'];
    return required.every(key => Boolean(process.env[key]));
}
