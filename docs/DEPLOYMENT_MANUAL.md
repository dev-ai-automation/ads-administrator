# Manual Deployment Guide - Render

> **Step-by-step manual deployment** for Ads Administrator Platform on Render.

---

## 📋 Prerequisites

- [ ] GitHub account
- [ ] Render account ([render.com](https://render.com))
- [ ] Auth0 account configured
- [ ] Code pushed to GitHub repository

---

## 🚀 Deployment Steps

### Step 1: Create Render Account & Connect GitHub

1. Go to [render.com](https://render.com) → **Sign Up**
2. Choose **Sign up with GitHub**
3. Authorize Render to access your repositories

---

### Step 2: Create PostgreSQL Database

1. In Render Dashboard → **New** → **PostgreSQL**
2. Configure database:
   ```
   Name: ads-db
   Database: ads_admin
   User: ads_user
   Region: Oregon (US West) or closest to you
   Plan: Free
   ```
3. Click **Create Database**
4. **Wait 2-3 minutes** for database to provision
5. Copy **Internal Database URL** (format: `postgresql://...`)
   - Find in database details page

---

### Step 3: Deploy Backend (FastAPI)

1. In Dashboard → **New** → **Web Service**
2. Select your repository: `dev-ai-automation/ads-administrator`
3. Configure service:
   ```
   Name: ads-backend
   Region: Same as database
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port 10000
   Plan: Free
   ```

4. **Add Environment Variables** (scroll down):
   ```
   DATABASE_URL = <paste Internal Database URL from Step 2>
   AUTH0_DOMAIN = your-tenant.us.auth0.com
   AUTH0_API_AUDIENCE = https://api.ads-admin.com
   SECRET_KEY = <generate random string: openssl rand -hex 32>
   ALGORITHM = HS256
   PYTHON_VERSION = 3.10.0
   ```

5. Click **Create Web Service**
6. **Wait 5-10 minutes** for first deployment
7. Copy **Service URL** (e.g., `https://ads-backend.onrender.com`)

---

### Step 4: Configure Auth0 for Backend

1. Go to [Auth0 Dashboard](https://manage.auth0.com)
2. **APIs** → Select your API (or create new)
3. Set **Identifier**: `https://api.ads-admin.com` (must match `AUTH0_API_AUDIENCE`)
4. **Settings** → Enable **RS256** algorithm
5. **Permissions** (if needed):
   ```
   read:clients
   write:clients
   read:metrics
   ```

---

### Step 5: Deploy Frontend (Next.js)

1. In Dashboard → **New** → **Web Service**
2. Select repository: `dev-ai-automation/ads-administrator`
3. Configure service:
   ```
   Name: ads-frontend
   Region: Same as backend
   Branch: main
   Root Directory: frontend
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Plan: Free
   ```

4. **Add Environment Variables**:
   ```
   NODE_VERSION = 18.17.0
   NEXT_PUBLIC_API_URL = <paste backend URL from Step 3>
   
   # Auth0 Frontend
   AUTH0_SECRET = <generate: openssl rand -hex 32>
   AUTH0_BASE_URL = https://<your-frontend-name>.onrender.com
   AUTH0_ISSUER_BASE_URL = https://your-tenant.us.auth0.com
   AUTH0_CLIENT_ID = <from Auth0 Application>
   AUTH0_CLIENT_SECRET = <from Auth0 Application>
   ```

5. Click **Create Web Service**
6. **Wait 5-10 minutes** for deployment
7. Copy **Frontend URL** (e.g., `https://ads-frontend.onrender.com`)

---

### Step 6: Configure Auth0 for Frontend

1. Go to Auth0 Dashboard → **Applications**
2. Select your application (or create new **Regular Web Application**)
3. **Settings**:
   ```
   Name: Ads Admin Frontend
   Application Type: Regular Web Application
   
   Allowed Callback URLs:
   https://ads-frontend.onrender.com/api/auth/callback
   
   Allowed Logout URLs:
   https://ads-frontend.onrender.com
   
   Allowed Web Origins:
   https://ads-frontend.onrender.com
   ```
4. Copy **Client ID** and **Client Secret**
5. Update frontend env vars in Render (repeat Step 5.4 with real values)

---

### Step 7: Verify Deployment

1. **Backend Health Check**:
   ```
   https://ads-backend.onrender.com/health
   Expected: {"status": "healthy"}
   ```

2. **Backend API Docs**:
   ```
   https://ads-backend.onrender.com/docs
   Expected: Swagger UI
   ```

3. **Frontend**:
   ```
   https://ads-frontend.onrender.com
   Expected: Landing page loads
   ```

4. **Test Login**:
   - Click **Login** → Should redirect to Auth0
   - Login with test user
   - Should redirect back to dashboard

---

## 🔧 Post-Deployment

### Update CORS (if needed)
If frontend can't reach backend:

1. Edit `backend/app/main.py`:
   ```python
   allow_origins=[
       "https://ads-frontend.onrender.com",  # Add this
   ],
   ```
2. Push to GitHub → Auto-redeploy

### Enable Auto-Deploy
Both services auto-deploy on git push to `main` by default.

### Monitor Logs
- Render Dashboard → Select service → **Logs** tab

---

## 🐛 Troubleshooting

| Issue | Solution |
|:------|:---------|
| Backend won't start | Check `DATABASE_URL` format, verify all env vars set |
| Frontend shows 500 | Check `NEXT_PUBLIC_API_URL` points to backend URL |
| Auth0 redirect fails | Verify callback URLs in Auth0 match frontend URL exactly |
| CORS errors | Add frontend URL to backend CORS `allow_origins` |
| Free tier sleeps | First request after inactivity takes ~30s to wake |

---

## 📊 Free Tier Limits

- **Web Service**: 750 hours/month, sleeps after 15min inactivity
- **PostgreSQL**: 90 days, 1GB storage, 97 connection limit
- **Bandwidth**: 100GB/month

---

## 📚 References

- [Render FastAPI Guide](https://render.com/docs/deploy-fastapi)
- [Render Next.js Guide](https://render.com/docs/deploy-nextjs-app)
- [Render PostgreSQL](https://render.com/docs/databases)
- [Auth0 Quick Start](https://auth0.com/docs/quickstart)

---

**Total Deployment Time: ~20-30 minutes** ⏱️
