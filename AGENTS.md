# AGENTS.md

## Purpose
This file helps AI coding agents understand the repository layout, main workflows, and important conventions for making productive changes quickly.

## Repository structure
- `backend/` — Express API, Sequelize models, Swagger docs, and server logic.
- `frontend/` — React + Vite SPA with Tailwind, route-based pages, region-aware router, and API client.
- `plugins/`, `themes/`, `extras/` — WordPress deployment assets. Do not modify WordPress core outside these directories.
- `config/nginx.conf` — container/Nginx configuration for the WordPress platform.
- `README.md` — root project overview and Docker deployment notes.

## What agents should know
- This is a mixed repository with a WordPress deployment template and a separate React/Express app.
- The backend serves static files from `frontend/dist` and also exposes API endpoints under `/auth`, `/users`, and `/api`.
- The frontend uses environment variables from Vite, especially `VITE_API_URL` for the backend base URL.
- Backend startup is managed in `backend/index.js` and listens on port `80`.
- The backend uses Sequelize with database configuration in `backend/src/config/database.js`.
- Swagger docs are mounted at `backend/src/app.js` under `/api-docs`.

## Recommended agent behavior
- Prefer changing only the app code in `frontend/` or `backend/` unless the task specifically involves WordPress deployment, Docker, or plugin/theme packaging.
- Do not attempt to modify WordPress core files; use `plugins/`, `themes/`, and `extras/` for custom WordPress content.
- When editing API integrations, update both backend routes/controllers and frontend API wrappers as needed.
- Keep frontend code consistent with existing React + Vite patterns, including hooks, context providers, and the router layout.
- Keep backend code consistent with Express middleware, route validation, and centralized error handling.

## Useful commands
- Frontend development: `cd frontend && npm install && npm run dev`
- Frontend build: `cd frontend && npm run build`
- Frontend lint: `cd frontend && npm run lint`
- Backend development: `cd backend && npm install && npm run dev`
- Backend production: `cd backend && npm install && npm start`

## Key files
- `backend/src/app.js` — Express application setup, middleware, static serving, and route registration.
- `backend/src/routes/*.js` — API endpoint definitions.
- `backend/src/controllers/*.js` — business logic for auth, user, playlist, and Spotify flows.
- `frontend/src/api/backendApi.js` — central backend API client used across the React app.
- `frontend/src/router/routes.jsx` — route configuration and navigation behavior.
- `frontend/src/pages/` — page components for the main user flows.

## Links to existing docs
- [Root README](README.md)
- [Frontend README](frontend/README.md)
- [Plugins README](plugins/README.md)
- [Themes README](themes/README.md)
- [Extras README](extras/README.md)

## Notes for agents
- If a task involves deployment or platform configuration, reference `config/nginx.conf`, `Dockerfile`, and the root `README.md`.
- If a task involves authentication or Spotify integration, inspect both backend route definitions and frontend calls in `frontend/src/api/`.
- Avoid assuming this is a pure monorepo; the WordPress platform assets and the React/Express app are separate concerns.
