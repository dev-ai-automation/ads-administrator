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

4. **Agregar Variables de Entorno**:
   ```
   NODE_VERSION = 20
   NEXT_PUBLIC_API_URL = <pegar URL del backend del Paso 3>
   
   # Auth0 Frontend
   AUTH0_SECRET = <generar: openssl rand -hex 32>
   AUTH0_BASE_URL = https://<nombre-de-tu-frontend>.onrender.com
   AUTH0_ISSUER_BASE_URL = https://tu-tenant.us.auth0.com
   AUTH0_CLIENT_ID = <desde Auth0 Application>
   AUTH0_CLIENT_SECRET = <desde Auth0 Application>
   ```

5. Clic en **Create Web Service**
6. **Esperar 5-10 minutos** para el deployment
7. Copiar **Frontend URL** (ej: `https://ads-frontend.onrender.com`)

---

### Paso 6: Configurar Auth0 para el Frontend

1. Ir al Dashboard de Auth0 → **Applications**
2. Seleccionar tu aplicación (o crear nueva **Regular Web Application**)
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
4. Copiar **Client ID** y **Client Secret**
5. Actualizar variables de entorno del frontend en Render (repetir Paso 5.4 con valores reales)

---

### Paso 7: Verificar el Deployment

1. **Health Check del Backend**:
   ```
   https://ads-backend.onrender.com/health
   Esperado: {"status": "healthy"}
   ```

2. **Documentación de la API del Backend**:
   ```
   https://ads-backend.onrender.com/docs
   Esperado: Swagger UI
   ```

3. **Frontend**:
   ```
   https://ads-frontend.onrender.com
   Esperado: La página de inicio carga correctamente
   ```

4. **Probar Login**:
   - Hacer clic en **Login** → Debe redirigir a Auth0
   - Iniciar sesión con usuario de prueba
   - Debe redirigir de vuelta al dashboard

---

## 🔧 Post-Deployment

### Actualizar CORS (si es necesario)
Si el frontend no puede conectarse al backend:

1. Editar `backend/app/main.py`:
   ```python
   allow_origins=[
       "https://ads-frontend.onrender.com",  # Agregar esta línea
   ],
   ```
2. Push a GitHub → Auto-redeploy

### Habilitar Auto-Deploy
Ambos servicios se auto-deployean en push a `main` por defecto.

### Monitorear Logs
- Dashboard de Render → Seleccionar servicio → Pestaña **Logs**

---

## 🐛 Solución de Problemas

| Problema | Solución |
|:---------|:---------|
| Backend no inicia | Verificar formato de `DATABASE_URL`, confirmar que todas las env vars estén configuradas |
| Frontend muestra error 500 | Verificar que `NEXT_PUBLIC_API_URL` apunte a la URL del backend |
| Falla el redirect de Auth0 | Verificar que las callback URLs en Auth0 coincidan exactamente con la URL del frontend |
| Errores de CORS | Agregar URL del frontend a `allow_origins` del backend |
| Free tier se duerme | La primera petición después de inactividad toma ~30s en despertar |

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
