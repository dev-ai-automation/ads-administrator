# Services & Credentials Guide

> [!WARNING]
> This document contains templates and variable names. **NEVER** commit actual secrets, passwords, or API keys to this file or the repository.

## Required Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example / Note |
| :--- | :--- | :--- |
| `DATABASE_URL` | Connection string for PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `AUTH0_DOMAIN` | Auth0 Tenant Domain | `dev-xyz.us.auth0.com` |
| `AUTH0_API_AUDIENCE` | Auth0 API Identifier | `https://api.ads-admin.com` |
| `SECRET_KEY` | Application Secret for crypto ops | `super-secret-string` |
| `ALGORITHM` | Encryption algorithm | `HS256` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Example / Note |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_AUTH0_DOMAIN` | Auth0 Domain (Public) | `dev-xyz.us.auth0.com` |
| `NEXT_PUBLIC_AUTH0_CLIENT_ID`| Auth0 Client ID | `ClientIDString` |
| `NEXT_PUBLIC_API_URL` | Check `render.yaml` injects this | `https://ads-backend.onrender.com` |

## External Services Configuration

### 1. Render
- **Account**: Admin User
- **Project**: Ads Administrator
- **DB Credentials**: Auto-managed by Render mostly, but available in dashboard details.

### 2. Auth0
- **Tenant**: Development
- **Application**: "Ads Admin Frontend" (SPA)
- **API**: "Ads Admin Backend" (Identifier: `AUTH0_API_AUDIENCE`)
- **Settings**:
    - Allowed Callback URLs: `http://localhost:3000/api/auth/callback`, `https://<your-frontend>.onrender.com/api/auth/callback`
    - Allowed Logout URLs: `http://localhost:3000`, `https://<your-frontend>.onrender.com`
    - Allowed Origins: `http://localhost:3000`, `https://<your-frontend>.onrender.com`

### 3. PostgreSQL (Database)
- **Host**: Provided by Render
- **Connection**: Only accessible from allowed IPs or within Render network.
