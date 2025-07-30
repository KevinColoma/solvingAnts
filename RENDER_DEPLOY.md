# Instrucciones para desplegar en Render

## Backend (Web Service)
1. Conecta tu repositorio de GitHub a Render
2. Crea un nuevo "Web Service"
3. Configuración:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node.js
   - **Auto-Deploy**: Yes

## Frontend (Static Site)
1. Crea un nuevo "Static Site" en Render
2. Conecta el mismo repositorio
3. Configuración:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Auto-Deploy**: Yes

## Variables de Entorno
Backend:
- PORT se configura automáticamente por Render

Frontend:
- Actualiza la URL del backend en `src/App.js` línea 7:
  ```javascript
  const API_BASE_URL = 'https://tu-backend-app.onrender.com';
  ```

## URLs de ejemplo después del despliegue:
- Backend: https://ants-simulation-backend.onrender.com
- Frontend: https://ants-simulation-frontend.onrender.com
