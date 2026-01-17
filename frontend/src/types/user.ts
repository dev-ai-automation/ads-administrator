/**
 * User Types - TypeScript interfaces for authentication.
 */

/**
 * User profile data from Auth0 JWT.
 */
export interface UserProfile {
    /** Auth0 user ID (sub claim) */
    id: string;
    /** User email address */
    email?: string | null;
    /** User permissions/scopes */
    permissions: string[];
}

/**
 * Auth0 configuration for the frontend.
 */
export interface AuthConfig {
    domain: string;
    clientId: string;
    audience: string;
}
