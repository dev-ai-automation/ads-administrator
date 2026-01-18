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
 * Configuration is passed explicitly to support both env var names.
 * The SDK supports both AUTH0_DOMAIN and AUTH0_ISSUER_BASE_URL.
 */
export const auth0 = new Auth0Client({
    // Domain can be set via AUTH0_DOMAIN or domain option
    domain: process.env['AUTH0_DOMAIN'] || process.env['AUTH0_ISSUER_BASE_URL']?.replace('https://', ''),

    // App base URL
    appBaseUrl: process.env['AUTH0_BASE_URL'] || process.env['APP_BASE_URL'],

    // Client credentials
    clientId: process.env['AUTH0_CLIENT_ID'],
    clientSecret: process.env['AUTH0_CLIENT_SECRET'],

    // Session secret
    secret: process.env['AUTH0_SECRET'],

    // API audience for access tokens
    authorizationParameters: {
        audience: process.env['AUTH0_AUDIENCE'],
        scope: 'openid profile email offline_access',
    },
});

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
    const domain = process.env['AUTH0_DOMAIN'] || process.env['AUTH0_ISSUER_BASE_URL'];
    const baseUrl = process.env['AUTH0_BASE_URL'] || process.env['APP_BASE_URL'];
    const required = [domain, baseUrl, process.env['AUTH0_CLIENT_ID'], process.env['AUTH0_CLIENT_SECRET'], process.env['AUTH0_SECRET']];
    return required.every(val => Boolean(val));
}
