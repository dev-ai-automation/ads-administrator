# Guía de Deployment Manual - Render

> **Deployment manual paso a paso** para la Plataforma Ads Administrator en Render.

---

## 📋 Prerequisitos

- [ ] Cuenta de GitHub
- [ ] Cuenta de Render ([render.com](https://render.com))
- [ ] Cuenta de Auth0 configurada
- [ ] Código pusheado al repositorio de GitHub

---

## 🚀 Pasos de Deployment

### Paso 1: Crear Cuenta en Render y Conectar GitHub

1. Ir a [render.com](https://render.com) → **Sign Up**
2. Elegir **Sign up with GitHub**
3. Autorizar a Render para acceder a tus repositorios

---

### Paso 2: Crear Base de Datos PostgreSQL

1. En el Dashboard de Render → **New** → **PostgreSQL**
2. Configurar la base de datos:
   ```
   Name: ads-db
   Database: ads_admin
   User: ads_user
   Region: Oregon (US West) o el más cercano a ti
   Plan: Free
   ```
3. Clic en **Create Database**
4. **Esperar 2-3 minutos** para que la base de datos se aprovisione
5. Copiar **Internal Database URL** (formato: `postgresql://...`)
   - Se encuentra en la página de detalles de la base de datos

---

### Paso 3: Deployar Backend (FastAPI)

1. En Dashboard → **New** → **Web Service**
2. Seleccionar tu repositorio: `dev-ai-automation/ads-administrator`
3. Configurar el servicio:
   ```
   Name: ads-backend
   Region: Mismo que la base de datos
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port 10000
   Plan: Free
   ```

4. **Agregar Variables de Entorno** (desplazarse hacia abajo):
   ```
   DATABASE_URL = <pegar Internal Database URL del Paso 2>
   AUTH0_DOMAIN = tu-tenant.us.auth0.com
   AUTH0_API_AUDIENCE = https://api.ads-admin.com
   SECRET_KEY = <generar string aleatorio: openssl rand -hex 32>
   ALGORITHM = HS256
   PYTHON_VERSION = 3.10.0
   ```

5. Clic en **Create Web Service**
6. **Esperar 5-10 minutos** para el primer deployment
7. Copiar **Service URL** (ej: `https://ads-backend.onrender.com`)

---

### Paso 4: Configurar Auth0 para el Backend

1. Ir al [Dashboard de Auth0](https://manage.auth0.com)
2. **APIs** → Seleccionar tu API (o crear nueva)
3. Establecer **Identifier**: `https://api.ads-admin.com` (debe coincidir con `AUTH0_API_AUDIENCE`)
4. **Settings** → Habilitar algoritmo **RS256**
5. **Permissions** (si es necesario):
   ```
   read:clients
   write:clients
   read:metrics
   ```

---

### Paso 5: Deployar Frontend (Next.js)

1. En Dashboard → **New** → **Web Service**
2. Seleccionar repositorio: `dev-ai-automation/ads-administrator`
3. Configurar el servicio:
   ```
   Name: ads-frontend
   Region: Mismo que el backend
   Branch: main
   Root Directory: frontend          ⚠️ IMPORTANTE: "frontend" no "fronted"
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Plan: Free
   ```
   
   > [!CAUTION]
   > El **Root Directory** debe ser exactamente `frontend` (con "e" al final). Un error común es escribir `fronted` lo cual causará un error de deployment.

4. **Agregar Variables de Entorno** (CRÍTICO - todas son requeridas):
   
   > [!IMPORTANT]
   > El frontend **NO funcionará** sin estas variables. Debes configurarlas TODAS antes de que el servicio pueda iniciar correctamente.
   
   **Variables Básicas:**
   ```
   NODE_VERSION = 20
   NEXT_PUBLIC_API_URL = <pegar URL del backend del Paso 3>
   Ejemplo: https://ads-backend.onrender.com
   ```
   
   **Variables de Auth0 (REQUERIDAS):**
   ```
   AUTH0_SECRET = <generar nuevo: openssl rand -hex 32>
   AUTH0_BASE_URL = https://<nombre-exacto-del-servicio>.onrender.com
   AUTH0_ISSUER_BASE_URL = https://<tu-tenant>.us.auth0.com
   AUTH0_CLIENT_ID = <copiar desde Auth0 Dashboard → Applications → Tu App → Settings>
   AUTH0_CLIENT_SECRET = <copiar desde Auth0 Dashboard → Applications → Tu App → Settings>
   ```
   
   **Cómo generar AUTH0_SECRET:**
   ```bash
   # En tu terminal local (Git Bash, PowerShell, o terminal de Linux/Mac)
   openssl rand -hex 32
   
   # Copia el resultado, ejemplo: a1b2c3d4e5f6...
   ```
   
   **Dónde encontrar las credenciales de Auth0:**
   1. Ve a [Auth0 Dashboard](https://manage.auth0.com)
   2. Applications → Tu aplicación (ads-admin-frontend)
   3. Settings tab → Basic Information
   4. Copia **Domain**, **Client ID**, y **Client Secret**
   
   > [!CAUTION]
   > **AUTH0_BASE_URL** debe coincidir EXACTAMENTE con la URL de tu servicio en Render. Si tu servicio se llama `ads-frontend-abc123`, la URL será `https://ads-frontend-abc123.onrender.com`

5. Clic en **Create Web Service**
6. **Esperar 5-10 minutos** para el deployment
7. Copiar **Frontend URL** (ej: `https://ads-frontend.onrender.com`)

---

### Paso 6: Configurar Auth0 para el Frontend

> [!IMPORTANT]
> Este paso es CRÍTICO. Sin esta configuración, el login no funcionará.

1. Ir al [Dashboard de Auth0](https://manage.auth0.com) → **Applications**
2. Crear nueva aplicación o seleccionar existente:
   - Tipo: **Regular Web Application** (NO Single Page Application)
   - Nombre: `Ads Admin Frontend`

3. En la pestaña **Settings**, configurar **Application URIs**:
   
   **Allowed Callback URLs** (agregar AMBAS):
   ```
   http://localhost:3000/api/auth/callback
   https://ads-frontend-<tu-id>.onrender.com/api/auth/callback
   ```
   
   **Allowed Logout URLs** (agregar AMBAS):
   ```
   http://localhost:3000
   https://ads-frontend-<tu-id>.onrender.com
   ```
   
   **Allowed Web Origins** (agregar AMBAS):
   ```
   http://localhost:3000
   https://ads-frontend-<tu-id>.onrender.com
   ```
   
   > [!CAUTION]
   > Reemplaza `<tu-id>` con el ID exacto de tu servicio Render. Ejemplo: si tu URL es `https://ads-frontend-abc123.onrender.com`, usa esa URL completa.

4. **Copiar credenciales** (las necesitarás en el Paso 5):
   - **Domain**: `dev-xyz.us.auth0.com` (copia sin `https://`)
   - **Client ID**: `String largo alfanumérico`
   - **Client Secret**: `String largo secreto` (click "Show" para verlo)

5. **Guardar cambios** (botón al final de la página)

6. **Volver a Render** y agregar/verificar las env vars del Paso 5 con estos valores

---

### Paso 7: Verificar el Deployment

1. **Backend Health Check**:
   ```
   https://ads-backend.onrender.com/health
   Esperado: {"status": "healthy"}
   ```

2. **Backend API Docs**:
   ```
   https://ads-backend.onrender.com/docs
   Esperado: Swagger UI
   ```

3. **Frontend - Verificar que carga**:
   ```
   https://ads-frontend.onrender.com
   Esperado: Página de inicio SIN errores de "Auth0 Configuration Required"
   ```

4. **Probar Login Completo**:
   - Hacer clic en **Login** → Debe redirigir a Auth0
   - Iniciar sesión con usuario de prueba
   - Debe redirigir de vuelta al dashboard SIN errores

---

## � Solución de Problemas

| Problema | Causa | Solución |
|:---------|:------|:---------|
| **"Auth0 Configuration Required"** | Faltan variables de entorno en frontend | 1. Ve a Render → `ads-frontend` → Environment<br>2. Verifica que TODAS las variables AUTH0_* estén configuradas<br>3. Redeploy manual si es necesario |
| **"Invalid token header"** | Problema de comunicación backend-frontend | 1. Verifica `NEXT_PUBLIC_API_URL` apunte al backend correcto<br>2. Verifica CORS en `backend/app/main.py` incluye frontend URL<br>3. Verifica `AUTH0_API_AUDIENCE` sea igual en backend y Auth0 API |
| Backend no inicia | Formato de `DATABASE_URL` incorrecto | Verificar formato de `DATABASE_URL`, confirmar que todas las env vars estén configuradas |
| Frontend muestra error 500 | `NEXT_PUBLIC_API_URL` incorrecto | Verificar que apunte a la URL del backend (debe terminar en `.onrender.com`) |
| Falla el redirect de Auth0 | Callback URLs no coinciden | 1. Ir a Auth0 Dashboard → Applications → Settings<br>2. Verificar que **Allowed Callback URLs** incluya la URL exacta de Render<br>3. Debe ser: `https://tu-servicio.onrender.com/api/auth/callback` |
| Errores de CORS | Frontend URL no está en allow_origins | Agregar URL del frontend a `allow_origins` en `backend/app/main.py` |
| Free tier se duerme | Inactividad > 15 minutos | La primera petición después de inactividad toma ~30s en despertar |
| **Variables de entorno no se aplican** | No se guardaron o no se hizo redeploy | 1. Guardar cambios en Render<br>2. Manual Deploy → Deploy latest commit |

### Pasos Detallados para "Auth0 Configuration Required"

Si ves este error en amarillo en el frontend:

1. **Ir a Render Dashboard** → Seleccionar `ads-frontend`
2. **Environment** (menú izquierdo)
3. **Verificar estas 5 variables existen**:
   ```
   AUTH0_SECRET = [string de 64 caracteres hexadecimales]
   AUTH0_BASE_URL = https://ads-frontend-<id>.onrender.com
   AUTH0_ISSUER_BASE_URL = https://<tenant>.us.auth0.com
   AUTH0_CLIENT_ID = [Client ID desde Auth0]
   AUTH0_CLIENT_SECRET = [Client Secret desde Auth0]
   ```
4. Si falta alguna, **Add Environment Variable**
5. **Save Changes**
6. Ir a **Manual Deploy** → **Deploy latest commit**
7. Esperar 3-5 minutos al redeploy
8. Refrescar el frontend

---

---

## 📊 Límites del Free Tier

- **Web Service**: 750 horas/mes, se duerme después de 15min de inactividad
- **PostgreSQL**: 90 días, 1GB de almacenamiento, límite de 97 conexiones
- **Ancho de banda**: 100GB/mes

---

## 📚 Referencias

- [Guía de Render para FastAPI](https://render.com/docs/deploy-fastapi)
- [Guía de Render para Next.js](https://render.com/docs/deploy-nextjs-app)
- [PostgreSQL en Render](https://render.com/docs/databases)
- [Inicio Rápido de Auth0](https://auth0.com/docs/quickstart)

---

**Tiempo Total de Deployment: ~20-30 minutos** ⏱️
