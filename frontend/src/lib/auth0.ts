/**
 * Auth0 SDK Configuration.
 * 
 * This file configures the Auth0 Next.js SDK (v4.x) for App Router.
 * Uses environment variables for all sensitive settings.
 * Uses lazy initialization to avoid build-time errors.
 * 
 * See: https://github.com/auth0/nextjs-auth0/blob/main/V4_MIGRATION_GUIDE.md
 */
import { Auth0Client } from '@auth0/nextjs-auth0/server';

// =============================================================================
// AUTH0 CLIENT CONFIGURATION
// =============================================================================

/**
 * Lazy-initialized Auth0 client instance.
 * Created only when first accessed to avoid build-time evaluation.
 */
let _auth0Client: Auth0Client | null = null;

/**
 * Get Auth0 client instance (exported for middleware use).
 * Uses lazy initialization to avoid build-time errors.
 */
export function getAuth0Client(): Auth0Client {
    if (!_auth0Client) {
        _auth0Client = new Auth0Client({
            // Domain can be set via AUTH0_DOMAIN or domain option
            domain: process.env['AUTH0_DOMAIN'] || process.env['AUTH0_ISSUER_BASE_URL']?.replace('https://', ''),

            // App base URL
            appBaseUrl: getBaseUrl(),

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

            // Auth0 SDK v4 routes (no /api prefix)
            // The middleware handles these routes automatically
            routes: {
                login: '/auth/login',
                logout: '/auth/logout',
                callback: '/auth/callback',
            },
        });
    }
    return _auth0Client;
}

/**
 * Auth0 client with lazy initialization
 */
export const auth0 = {
    async getSession(req?: any) {
        return getAuth0Client().getSession(req);
    },
    async getAccessToken(req?: any, res?: any) {
        return getAuth0Client().getAccessToken(req, res);
    },
};

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
 * Get the application base URL with Render support.
 */
export function getBaseUrl(): string {
    // 1. Render External URL (Automatic and always correct on Render)
    // This takes priority because Render automatically sets it correctly
    if (process.env['RENDER_EXTERNAL_URL']) {
        return process.env['RENDER_EXTERNAL_URL'];
    }

    // 2. Explicit Auth0 configuration (fallback for non-Render deployments)
    if (process.env['AUTH0_BASE_URL']) {
        return process.env['AUTH0_BASE_URL'];
    }

    // 3. Generic App Base URL
    if (process.env['APP_BASE_URL']) {
        return process.env['APP_BASE_URL'];
    }

    // 4. Default to localhost for development
    return 'http://localhost:10000';
}

/**
 * Check if Auth0 is configured (environment variables are set).
 */
export function isAuth0Configured(): boolean {
    const domain = process.env['AUTH0_DOMAIN'] || process.env['AUTH0_ISSUER_BASE_URL'];
    const baseUrl = getBaseUrl();
    const required = [domain, baseUrl, process.env['AUTH0_CLIENT_ID'], process.env['AUTH0_CLIENT_SECRET'], process.env['AUTH0_SECRET']];
    return required.every(val => Boolean(val));
}
