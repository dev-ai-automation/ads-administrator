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

function getAuth0Client(): Auth0Client {
    if (!_auth0Client) {
        _auth0Client = new Auth0Client({
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
    }
    return _auth0Client;
}

/**
 * Auth0 client with lazy initialization
 */
export const auth0 = {
    getSession: async (...args: Parameters<Auth0Client['getSession']>) => {
        return getAuth0Client().getSession(...args);
    },
    getAccessToken: async (...args: Parameters<Auth0Client['getAccessToken']>) => {
        return getAuth0Client().getAccessToken(...args);
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
 * Check if Auth0 is configured (environment variables are set).
 */
export function isAuth0Configured(): boolean {
    const domain = process.env['AUTH0_DOMAIN'] || process.env['AUTH0_ISSUER_BASE_URL'];
    const baseUrl = process.env['AUTH0_BASE_URL'] || process.env['APP_BASE_URL'];
    const required = [domain, baseUrl, process.env['AUTH0_CLIENT_ID'], process.env['AUTH0_CLIENT_SECRET'], process.env['AUTH0_SECRET']];
    return required.every(val => Boolean(val));
}
