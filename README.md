# NHM Fund Monitor

This project is a prototype implementation of the **NHM Fund Monitor** system. The current folder contains a static HTML/CSS/JS prototype for the UI, and a new backend has been scaffolded using Node.js, Express, and TypeScript.

## Backend (Node.js + Express + TypeScript)

The backend lives in the `backend/` folder and is designed to align with the architecture described in `PROJECT_ARCHITECTURE.md`.

### Features implemented so far

- Basic Express app and server
- `GET /api/health` health check endpoint
- Placeholder `POST /api/auth/login` endpoint that returns a demo token and user
- Placeholder `GET /api/projects` endpoint that returns a sample project list

### Running the backend (after installing Node and npm)

1. Open a terminal in the `backend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`.
4. Start the dev server:
   ```bash
   npm run dev
   ```

The API will listen on `http://localhost:5000` by default, with routes under `/api` (for example, `http://localhost:5000/api/health`).

You can later evolve this backend to include real authentication, PostgreSQL, Redis, MinIO, and the AI service as outlined in `PROJECT_ARCHITECTURE.md`.
