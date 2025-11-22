# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview

This repository contains a static HTML/CSS/JS prototype for the NHM Fund Monitor dashboards and a minimal Node.js/Express/TypeScript backend scaffold (in `backend/`). The documentation (`PROJECT_ARCHITECTURE.md` and files in `docs/`) describes a more complete, multi-service architecture that is not yet fully implemented in this codebase.

At present:
- The root HTML/CSS/JS files implement the UI flows (landing, login, role-specific dashboards, alerts, project detail, etc.).
- The backend exposes a basic Express app and server and is wired to mount an `/api` router, but most of the described endpoints and infrastructure integrations are not yet present.

When interpreting the docs, treat them as the target architecture and prefer the actual source tree and `package.json` for the current behavior.

## Key commands

### Backend (Node.js + Express + TypeScript)

All backend-related commands are run from `backend/`.

- Install dependencies (first-time setup)
  - `cd backend`
  - `npm install`
- Configure environment
  - Copy `backend/.env.example` to `backend/.env` and adjust values as needed.
- Run development server (auto-reload via `ts-node-dev`)
  - `npm run dev`
- Build TypeScript to JavaScript
  - `npm run build`
- Run compiled server (after `npm run build`)
  - `npm start`

There are currently no `lint` or `test` scripts defined in `backend/package.json`; if you add tooling (e.g., ESLint, Jest/Vitest), document the scripts here and in `docs/DEVELOPMENT.md` and prefer running tests and linters from within `backend/`.

### Static UI prototype (HTML/CSS/JS)

The UI prototype is static and can be opened directly in a browser without a build step.

- Main entry: open `index.html` in a browser.
- Other key pages (all in the repo root): `login.html`, `admin-dashboard.html`, `district-dashboard.html`, `auditor-dashboard.html`, `project-detail.html`, `alerts.html`, `reports.html`, `users.html`, `settings.html`, `auditor-upload.html`.

If you introduce a local static server (for example, via a Node-based file server), keep paths relative and ensure the navigation logic in `js/router.js` and `js/navigation_and_tabs.js` continues to resolve links correctly.

### Docker and multi-service setup (planned, not fully present)

`PROJECT_ARCHITECTURE.md` and `docs/DEVELOPMENT.md` describe a future setup with `frontend/`, `ai-service/`, additional workers, and root-level Docker Compose files. These directories and files (including the documented `docker-compose` commands) are not currently present in this repository.

Before using any Docker or multi-service commands from the docs, first verify that the corresponding folders and `docker-compose.yml` files actually exist; otherwise treat those sections as design guidance rather than executable instructions.

## Code architecture and structure

### 1. Static UI prototype (root HTML/CSS/JS)

The prototype is a multi-page static site with shared layout and navigation logic.

- **Page flows** (see `NAVIGATION_GUIDE.md` and `PATH_FIXES_SUMMARY.md` for full matrices):
  - `index.html` → `login.html` → role-specific login pages (`admin-login.html`, `district-login.html`, `auditor-login.html`).
  - Each role-specific login redirects to its dashboard: `admin-dashboard.html`, `district-dashboard.html`, or `auditor-dashboard.html`.
  - Dashboards link into feature pages: `project-detail.html`, `alerts.html`, `reports.html`, `users.html`, `settings.html`, and for auditors, `auditor-upload.html`.
- **Shared layout and behavior:**
  - `styles.css` defines the global visual system (colors, spacing, cards, animations, responsive breakpoints) used across all pages.
  - `js/router.js` is a page-level router that:
    - Derives a logical "page identifier" from the current URL and maps it to sidebar items.
    - Highlights the active nav item based on the current path.
    - Sets the visual page title (`.page-title`) and the document title.
    - Applies page-load transitions (fade/slide) to the main content containers.
    - Provides a `navigate(url)` helper that resolves relative paths, triggers a short fade-out, closes the mobile sidebar (via `window.sidebarManager`), and then updates `window.location.href`.
  - `js/navigation_and_tabs.js` adds a **universal click handler** and **tab system**:
    - Global click listener on `<a>` elements that resolves relative paths with `new URL(href, window.location.href)`, applies a fade-out on main content, closes the mobile sidebar, and then navigates, while respecting external links and Ctrl/Cmd+click.
    - Tab handling using `.tab-btn` elements and `.tab-panel` containers, with per-container scoping and simple show/hide + opacity transitions.
  - `js/sidebar.js` and `js/header.js` (see `NAVIGATION_FIXES.md` for details) encapsulate sidebar toggling, mobile behavior, and header updates; they are expected to be included in a consistent script order on dashboard-style pages.
- **HTML conventions:**
  - All dashboard-like pages share a common structure: a sidebar, a header, and a content container (`.dashboard-content`, `.alerts-content`, `.project-detail-content`, `.auditor-main`, etc.) that the router and navigation scripts target for transitions.
  - Navigation links are **relative** (no leading `/`), allowing the prototype to work when opened directly from the filesystem as well as from a simple static server.

When editing or extending the UI:
- Keep new pages wired into the navigation by following the existing patterns in `NAVIGATION_GUIDE.md` and updating the page map in `js/router.js` if you add new HTML files.
- Reuse the existing content container classes so that the global transition logic in `js/router.js` and `js/navigation_and_tabs.js` continues to apply.

### 2. Backend service (`backend/`)

The backend is currently a minimal Express app intended to grow into the full API described in `docs/API.md` and `PROJECT_ARCHITECTURE.md`.

- **Entry points:**
  - `src/server.ts` reads `PORT` from `process.env.PORT` (default `5000`) and calls `app.listen`, logging a startup message.
  - `src/app.ts` constructs and configures the Express app.
- **Middleware and configuration pipeline (`src/app.ts`):**
  - Loads environment variables via `dotenv.config()`.
  - Sets up `express.json()` for JSON request bodies.
  - Configures CORS using `cors`, with `origin` read from `process.env.CORS_ORIGIN` (fallback `'*'`).
  - Mounts the API under `/api` by importing and using `apiRouter` from `./routes` (the detailed routes/controllers/services described in the docs are not yet implemented).
- **Environment and external dependencies:**
  - `backend/.env.example` already contains placeholders for PostgreSQL, Redis, MinIO/S3, JWT, and the AI service URL, aligning with the architecture docs.
  - The current TypeScript sources, however, only use `PORT` and `CORS_ORIGIN`; database, Redis, storage, and AI integrations will need to be added as the architecture is built out (likely following the patterns sketched in `PROJECT_ARCHITECTURE.md`).

When adding new backend functionality:
- Follow the separation outlined in `PROJECT_ARCHITECTURE.md` and `docs/DEVELOPMENT.md`: routers for HTTP surface, controllers for request/response, services for business logic, models for database access, and middleware for cross-cutting concerns (auth, validation, error handling, uploads).
- Keep the public API aligned with `docs/API.md` and the database layer compatible with `docs/DATABASE_SCHEMA.md`.

### 3. Documentation and target full-stack architecture

Several markdown files describe the intended end-state of this system:

- `PROJECT_ARCHITECTURE.md` gives a comprehensive overview of the planned multi-service architecture (React/Vite frontend, Node/Express backend, Python/FastAPI AI service, worker processes, PostgreSQL, Redis, MinIO/S3, Docker, CI/CD, infra as code).
- `docs/DEVELOPMENT.md` describes a development workflow that assumes additional services and scripts (frontend, AI service, database migrations, seeding, linting, formatting, tests, Docker Compose commands).
- `docs/API.md` and `docs/DATABASE_SCHEMA.md` define the intended HTTP API contract and relational schema, respectively.

These documents are useful as **design references** when implementing missing pieces (e.g., adding a real database layer, implementing `/api/projects` beyond the prototype, introducing background jobs, or creating a React-based frontend). When there is a conflict between the docs and the current code, treat the code as the source of truth and update either the implementation or the docs to converge.
