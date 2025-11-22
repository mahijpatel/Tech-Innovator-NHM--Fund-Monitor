# NHM Fund Monitor - Development Setup Guide

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 15+
- Redis (optional, for background jobs)
- Docker & Docker Compose (optional, for containerized setup)

---

## Quick Start (Docker)

```bash
# Clone repository
git clone <repo-url>
cd nhm-fund-monitor

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Start all services
docker-compose up -d

# Run database migrations
docker-compose exec backend npm run migrate

# Seed database
docker-compose exec backend npm run seed

# Create admin user
docker-compose exec backend node scripts/create-admin.js
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MinIO Console: http://localhost:9001
- PostgreSQL: localhost:5432

---

## Local Development Setup

### 1. Backend Setup

```bash
cd backend
npm install

# Setup database
createdb nhm_fund_monitor

# Copy environment file
cp .env.example .env
# Edit .env with your local settings

# Run migrations
npm run migrate

# Seed database
npm run seed

# Start development server
npm run dev
```

Backend runs on: http://localhost:5000

### 2. Frontend Setup

```bash
cd frontend
npm install

# Copy environment file
cp .env.example .env.local
# Edit .env.local with API URL

# Start development server
npm run dev
```

Frontend runs on: http://localhost:3000

### 3. AI Service Setup (Optional)

```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start service
uvicorn app.main:app --reload --port 8000
```

---

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/project-detail-page
```

### 2. Make Changes

- Frontend: Edit files in `frontend/src/`
- Backend: Edit files in `backend/src/`
- Run tests: `npm test`

### 3. Commit Changes

```bash
git add .
git commit -m "feat: add project detail page"
```

### 4. Push and Create PR

```bash
git push origin feature/project-detail-page
# Create Pull Request on GitHub
```

---

## Code Structure Guidelines

### Frontend

- **Components**: Reusable UI components in `src/components/`
- **Pages**: Route components in `src/pages/`
- **Services**: API calls in `src/services/`
- **Hooks**: Custom hooks in `src/hooks/`
- **Types**: TypeScript types in `src/types/`

### Backend

- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic
- **Models**: Database models
- **Routes**: API route definitions
- **Middleware**: Request processing (auth, validation, etc.)

---

## Testing

### Backend Tests

```bash
cd backend
npm test              # Run all tests
npm run test:unit     # Unit tests only
npm run test:e2e      # End-to-end tests
```

### Frontend Tests

```bash
cd frontend
npm test              # Run all tests
npm run test:watch    # Watch mode
```

---

## Database Management

### Create Migration

```bash
# Prisma
npx prisma migrate dev --name add_user_table

# TypeORM
npm run migration:create -- AddUserTable
```

### Seed Database

```bash
npm run seed
```

### Reset Database

```bash
npm run migrate:reset
npm run seed
```

---

## Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/nhm_fund_monitor
JWT_SECRET=your-secret-key
MINIO_ENDPOINT=localhost
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
```

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Common Tasks

### Create Admin User

```bash
node scripts/create-admin.js
```

### Generate API Documentation

```bash
npm run docs:generate
```

### Lint Code

```bash
npm run lint
npm run lint:fix
```

### Format Code

```bash
npm run format
```

---

## Debugging

### Backend Debugging

```bash
# Use VS Code debugger or
node --inspect src/server.ts
```

### Frontend Debugging

- Use React DevTools browser extension
- Use VS Code debugger with Chrome extension

---

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Check connection string
psql $DATABASE_URL
```

### Port Already in Use

```bash
# Find process using port
lsof -i :5000
# Kill process
kill -9 <PID>
```

### Docker Issues

```bash
# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## Useful Commands

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Access database
docker-compose exec postgres psql -U postgres nhm_fund_monitor

# Run commands in container
docker-compose exec backend npm run migrate
```

---

## Next Steps

1. Read [API.md](./API.md) for API endpoints
2. Read [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for database structure
3. Review [ARCHITECTURE.md](../PROJECT_ARCHITECTURE.md) for system design
4. Start coding! 🚀

