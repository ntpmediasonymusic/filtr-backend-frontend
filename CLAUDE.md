# CLAUDE.md

## Proyecto
Filtr / SomosFiltr

## Arquitectura
- Repositorio monolítico con backend y frontend.
- `backend/`: API Node.js + Express.
- `frontend/`: SPA React + Vite + Tailwind.
- En producción, el backend puede servir el build estático de `frontend/dist`.
- Nginx funciona como proxy frontal hacia Node/Express.
- Hay archivos y carpetas relacionados con WordPress/despliegue: `plugins`, `themes`, `extras`, `Dockerfile`, `nginx.conf`. No deben modificarse sin confirmación explícita.

## Backend
- Entry point: `backend/index.js`.
- Express app: `backend/src/app.js`.
- Puerto por defecto detectado: `80`.
- Rutas principales:
  - `/auth`
  - `/users`
  - `/api`
- Stack:
  - Node.js
  - Express
  - Sequelize
  - MySQL
  - JWT
  - SendGrid
  - Spotify API
  - almacenamiento tipo S3/OBS

## Frontend
- React con Vite.
- Rutas con `react-router-dom`.
- Cliente API en `frontend/src/api/backendApi.js`.
- Variables Vite requeridas:
  - `VITE_API_URL`
  - `VITE_CMS_URL`
  - `VITE_CMS_TOKEN`
  - `VITE_BANDSINTOWN_APP_ID`
  - `VITE_UTM_SOURCE`
  - `VITE_UTM_MEDIUM`
  - `VITE_UTM_CAMPAIGN`

## Comandos
### Backend
- `cd backend`
- `npm install`
- `npm run dev`
- `npm run start`

### Frontend
- `cd frontend`
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

## Reglas de trabajo
1. Antes de modificar archivos, identifica los archivos afectados y explica el impacto.
2. No modificar variables de entorno reales, secretos, tokens, archivos `env/.env`, `nginx.conf`, `Dockerfile`, `database.js`, `storage.js`, `auth.controller.js`, `user.controller.js` o `backendApi.js` sin aprobación explícita.
3. No modificar `plugins`, `themes` o `extras` salvo que el cambio sea específicamente sobre WordPress/despliegue.
4. Preferir cambios pequeños, revisables y con `git diff` claro.
5. Después de cada cambio, indicar cómo probarlo en local.
6. Si una variable de entorno falta, proponer un `.env.example`, pero no inventar secretos reales.
7. Para frontend, validar responsive desktop/mobile cuando aplique.
8. Para auth, usuarios, CRM, opt-ins o emails, señalar riesgos de datos personales y compliance.

## Objetivo actual
Preparar el proyecto para desarrollo local seguro en un nuevo equipo, documentar comandos reales y evitar cambios accidentales en producción.
