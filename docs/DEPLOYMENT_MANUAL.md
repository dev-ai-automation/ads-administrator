# Guía de Deployment - Render

**Plataforma Ads Administrator** | Deployment en Render con Auth0

---

## 📋 Prerequisitos

- [ ] Cuenta de [GitHub](https://github.com)
- [ ] Cuenta de [Render](https://render.com)
- [ ] Cuenta de [Auth0](https://auth0.com) configurada
- [ ] Código en repositorio de GitHub

---

## 🚀 Deployment Paso a Paso

### 1. Base de Datos PostgreSQL

**Crear en Render:**
1. Dashboard → **New** → **PostgreSQL**
2. Configurar:
   - **Name:** `ads-db`
   - **Database:** `ads_admin`
   - **User:** `ads_user`
   - **Region:** Oregon (US West) o más cercano
   - **Plan:** Free
3. **Create Database**
4. Esperar 2-3 minutos
5. Copiar **Internal Database URL**

---

### 2. Backend (FastAPI)

**Crear servicio:**
1. Dashboard → **New** → **Web Service**
2. Seleccionar repositorio
3. Configurar:
   - **Name:** `ads-backend`
   - **Region:** Misma que la base de datos
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port 10000`
   - **Plan:** Free

**Agregar variables de entorno:**
```
DATABASE_URL = <Internal Database URL del Paso 1>
AUTH0_DOMAIN = dev-xyz.us.auth0.com
AUTH0_API_AUDIENCE = https://api.ads-admin.com
AUTH0_ALGORITHM = RS256
PYTHON_VERSION = 3.10.0
```

4. **Create Web Service**
5. Esperar 5-10 minutos
6. Copiar **Service URL** (ej: `https://ads-backend.onrender.com`)

---

### 3. Configurar Auth0 API

**En Auth0 Dashboard:**
1. **APIs** → Crear nueva o seleccionar existente
2. **Identifier:** `https://api.ads-admin.com` (debe coincidir con `AUTH0_API_AUDIENCE`)
3. **Signing Algorithm:** RS256
4. **Permissions** (opcional):
   - `read:clients`
   - `write:clients`
   - `read:metrics`

---

### 4. Frontend (Next.js)

**Crear servicio:**
1. Dashboard → **New** → **Web Service**
2. Seleccionar repositorio
3. Configurar:
   - **Name:** `ads-frontend`
   - **Region:** Misma que el backend
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free

**Agregar variables de entorno (TODAS requeridas):**

```bash
# Node.js
NODE_VERSION = 20

# Backend API
NEXT_PUBLIC_API_URL = <URL del backend del Paso 2>

# Auth0 (CRÍTICAS)
AUTH0_SECRET = <generar con: openssl rand -hex 32>
AUTH0_BASE_URL = https://ads-frontend-<tu-id>.onrender.com
AUTH0_ISSUER_BASE_URL = https://<tu-tenant>.us.auth0.com
AUTH0_CLIENT_ID = <desde Auth0 Dashboard>
AUTH0_CLIENT_SECRET = <desde Auth0 Dashboard>
AUTH0_AUDIENCE = https://api.ads-admin.com
```

> [!IMPORTANT]
> **AUTH0_BASE_URL** debe ser la URL exacta del servicio frontend en Render.
> **AUTH0_ISSUER_BASE_URL** debe incluir `https://`

4. **Create Web Service**
5. Esperar deployment (5-10 minutos)
6. Copiar **Frontend URL**

---

### 5. Configurar Auth0 Application

**CRÍTICO para que funcione el login:**

1. Auth0 Dashboard → **Applications** → Crear nueva
   - **Type:** Regular Web Application
   - **Name:** `Ads Admin Frontend`

2. **Settings** → Configurar URLs:

**Allowed Callback URLs:**
```
http://localhost:3000/api/auth/callback
https://ads-frontend-<tu-id>.onrender.com/api/auth/callback
```

**Allowed Logout URLs:**
```
http://localhost:3000
https://ads-frontend-<tu-id>.onrender.com
```

**Allowed Web Origins:**
```
http://localhost:3000
https://ads-frontend-<tu-id>.onrender.com
```

> [!CAUTION]
> Las URLs deben incluir `/api/auth/callback` (no `/auth/callback`)

3. **Copiar credenciales:**
   - **Domain:** `dev-xyz.us.auth0.com`
   - **Client ID:** String alfanumérico
   - **Client Secret:** Click "Show" para ver

4. **Save Changes**

5. Volver a Render y actualizar las env vars del frontend con estos valores

---

## 🧪 Verificación

### Backend
```bash
# Health check
https://ads-backend.onrender.com/health
# Esperado: {"status": "healthy"}

# API docs
https://ads-backend.onrender.com/docs
# Esperado: Swagger UI
```

### Frontend
```bash
# Home page
https://ads-frontend-<id>.onrender.com
# Esperado: No errors, no "Auth0 Configuration Required"

# Login flow
1. Click "Go to Dashboard"
2. Redirige a Auth0
3. Iniciar sesión
4. Redirige al dashboard
5. Dashboard carga datos sin errores
```

---

## 🔧 Troubleshooting

### "Auth0 Configuration Required"

**Causa:** Faltan variables de entorno

**Solución:**
1. Render → `ads-frontend` → Environment
2. Verificar que TODAS las variables `AUTH0_*` estén configuradas
3. Manual Deploy → Deploy latest commit
4. Esperar 3-5 minutos

---

### "Invalid token header"

**Causa:** Desajuste en configuración Auth0

**Solución:**
1. Verificar que `AUTH0_AUDIENCE` (frontend) = `AUTH0_API_AUDIENCE` (backend)
2. Verificar que `AUTH0_ISSUER_BASE_URL` incluye `https://`
3. Verificar CORS en backend incluye frontend URL
4. Redeploy backend y frontend

---

### Error de Callback URL

**Causa:** URLs no configuradas en Auth0

**Solución:**
1. Auth0 Dashboard → Applications → Settings
2. Allowed Callback URLs debe incluir:
   ```
   https://<tu-servicio-exacto>.onrender.com/api/auth/callback
   ```
3. Guardar cambios en Auth0
4. Esperar 1-2 minutos

---

### Variables no se aplican

**Solución:**
1. Verificar que se guardaron en Render
2. Manual Deploy → Deploy latest commit
3. Revisar logs del deployment

---

## 📊 Límites Free Tier

| Servicio | Límite |
|:---------|:-------|
| **Web Service** | 750 horas/mes<br>Se duerme tras 15min inactividad<br>Primera request ~30s |
| **PostgreSQL** | 90 días gratis<br>1GB almacenamiento<br>97 conexiones max |
| **Bandwidth** | 100GB/mes |

---

## 🎯 Checklist de Deployment

### Antes de Deployar
- [ ] Código pusheado a GitHub
- [ ] Auth0 Application creada
- [ ] Credenciales Auth0 copiadas

### Durante Deployment
- [ ] PostgreSQL creada
- [ ] Backend deployado con env vars
- [ ] Frontend deployado con env vars Auth0
- [ ] Callback URLs configuradas en Auth0

### Después de Deployment
- [ ] Backend `/health` responde OK
- [ ] Frontend carga sin errores
- [ ] Login flow funciona
- [ ] Dashboard carga datos

---

## 📚 Referencias

- [Render FastAPI](https://render.com/docs/deploy-fastapi)
- [Render Next.js](https://render.com/docs/deploy-nextjs-app)
- [Auth0 Next.js SDK](https://github.com/auth0/nextjs-auth0)
- [PostgreSQL en Render](https://render.com/docs/databases)

---

**Tiempo estimado:** 20-30 minutos | **Última actualización:** 2026-01-17
