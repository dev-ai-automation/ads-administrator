/**
 * Auth0 SDK Configuration.
 * 
 * This file initializes the Auth0 Next.js SDK with proper configuration.
 * Uses environment variables for all sensitive settings.
 * 
 * @see https://github.com/auth0/nextjs-auth0
 */
import { Auth0Client } from '@auth0/nextjs-auth0/server';

// =============================================================================
// ENVIRONMENT HELPERS
// =============================================================================

function getEnv(key: string): string {
    return process.env[key] ?? '';
}

function assertEnvConfigured(): void {
    const required = ['AUTH0_DOMAIN', 'AUTH0_CLIENT_ID', 'AUTH0_CLIENT_SECRET', 'AUTH0_BASE_URL'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(
            `Missing required Auth0 environment variables: ${missing.join(', ')}. ` +
            `Please check your .env.local file.`
        );
    }
}

// =============================================================================
// AUTH0 CLIENT CONFIGURATION
// =============================================================================

// Lazy-initialized Auth0 client to avoid build-time errors
let _auth0Client: Auth0Client | null = null;

function getAuth0Client(): Auth0Client {
    if (_auth0Client) {
        return _auth0Client;
    }

    // Only validate at runtime, not build time
    assertEnvConfigured();

    _auth0Client = new Auth0Client({
        domain: getEnv('AUTH0_DOMAIN'),
        clientId: getEnv('AUTH0_CLIENT_ID'),
        clientSecret: getEnv('AUTH0_CLIENT_SECRET'),
        appBaseUrl: getEnv('AUTH0_BASE_URL'),
        authorizationParameters: {
            audience: getEnv('AUTH0_AUDIENCE'),
            scope: 'openid profile email offline_access',
        },
        session: {
            rolling: true,
            absoluteDuration: 60 * 60 * 24 * 7, // 7 days
        },
        routes: {
            callback: '/auth/callback',
            login: '/auth/login',
            logout: '/auth/logout',
        },
    });

    return _auth0Client;
}

/**
 * Auth0 client instance for server-side authentication.
 * 
 * Uses lazy initialization to avoid build-time errors when
 * environment variables are not set.
 * 
 * Usage in Server Components:
 *   const session = await auth0.getSession();
 *   const accessToken = await auth0.getAccessToken();
 */
export const auth0 = {
    /**
     * Get the current user session.
     */
    async getSession(request?: Request) {
        // Auth0 SDK requires a request in middleware context
        // When called from Server Components, no request is needed
        if (request) {
            return getAuth0Client().getSession(request as Parameters<Auth0Client['getSession']>[0]);
        }
        return getAuth0Client().getSession();
    },

    /**
     * Get an access token for API calls.
     */
    async getAccessToken(request?: Request, response?: Response) {
        if (request && response) {
            return getAuth0Client().getAccessToken(
                request as Parameters<Auth0Client['getAccessToken']>[0],
                response as Parameters<Auth0Client['getAccessToken']>[1]
            );
        }
        return getAuth0Client().getAccessToken();
    },

    /**
     * Handle Auth0 authentication routes.
     */
    middleware(request: Request) {
        return getAuth0Client().middleware(request as Parameters<Auth0Client['middleware']>[0]);
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
    const required = ['AUTH0_DOMAIN', 'AUTH0_CLIENT_ID', 'AUTH0_CLIENT_SECRET', 'AUTH0_BASE_URL'];
    return required.every(key => Boolean(process.env[key]));
}
