# NHM Fund Monitor - Full-Stack Project Architecture

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Mobile**: PWA (Progressive Web App) - reuse React codebase
- **Backend**: Node.js + Express.js (or NestJS)
- **Database**: PostgreSQL 15+
- **Object Storage**: MinIO (S3-compatible) or AWS S3
- **Auth**: JWT + Role-based Access Control (RBAC)
- **AI Service**: Python + FastAPI (anomaly detection, image analysis)
- **Background Jobs**: BullMQ (Redis-based) or Node.js workers
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Optional (Prometheus + Grafana or hosted solution)

---

## High-Level Architecture

```
┌─────────────────┐
│   Frontend      │  React + Vite + Tailwind
│   (Port 3000)   │
└────────┬────────┘
         │ HTTP/REST
┌────────▼────────┐
│   Backend API   │  Node.js + Express
│   (Port 5000)   │  JWT Auth + RBAC
└────────┬────────┘
         │
    ┌────┴────┬──────────────┬─────────────┐
    │         │              │             │
┌───▼───┐ ┌──▼───┐    ┌─────▼─────┐  ┌───▼────┐
│PostgreSQL│ │ Redis │    │  MinIO/S3 │  │AI Service│
│         │ │       │    │          │  │(Python)  │
│         │ │       │    │          │  │(Port 8000)│
└─────────┘ └───────┘    └──────────┘  └──────────┘
```

---

## Complete Folder Structure

```
nhm-fund-monitor/
│
├── frontend/                          # React frontend application
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json              # PWA manifest
│   │
│   ├── src/
│   │   ├── components/                # Reusable UI components
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   └── Toggle.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Layout.tsx
│   │   │   └── charts/                # Chart components (if needed)
│   │   │
│   │   ├── pages/                     # Page components
│   │   │   ├── Dashboard/
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── DistrictDashboard.tsx
│   │   │   │   └── AuditorDashboard.tsx
│   │   │   ├── Projects/
│   │   │   │   ├── ProjectList.tsx
│   │   │   │   └── ProjectDetail.tsx
│   │   │   ├── Alerts/
│   │   │   │   └── AlertsPage.tsx
│   │   │   ├── Reports/
│   │   │   │   └── ReportsPage.tsx
│   │   │   ├── Settings/
│   │   │   │   └── SettingsPage.tsx
│   │   │   ├── Auth/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── RoleSelection.tsx
│   │   │   └── Upload/
│   │   │       └── EvidenceUpload.tsx
│   │   │
│   │   ├── services/                  # API service layer
│   │   │   ├── api.ts                 # Axios instance + interceptors
│   │   │   ├── auth.service.ts
│   │   │   ├── projects.service.ts
│   │   │   ├── alerts.service.ts
│   │   │   ├── reports.service.ts
│   │   │   └── upload.service.ts
│   │   │
│   │   ├── hooks/                     # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useProjects.ts
│   │   │   ├── useAlerts.ts
│   │   │   └── useUpload.ts
│   │   │
│   │   ├── store/                     # State management (Zustand/Redux)
│   │   │   ├── authStore.ts
│   │   │   ├── projectStore.ts
│   │   │   └── alertStore.ts
│   │   │
│   │   ├── utils/                     # Utility functions
│   │   │   ├── format.ts              # Date, currency formatting
│   │   │   ├── validation.ts          # Form validation
│   │   │   ├── constants.ts            # App constants
│   │   │   └── helpers.ts
│   │   │
│   │   ├── types/                     # TypeScript types
│   │   │   ├── auth.types.ts
│   │   │   ├── project.types.ts
│   │   │   ├── alert.types.ts
│   │   │   └── api.types.ts
│   │   │
│   │   ├── styles/                    # Global styles
│   │   │   ├── globals.css
│   │   │   └── tailwind.css
│   │   │
│   │   ├── App.tsx                    # Main app component
│   │   ├── main.tsx                   # Entry point
│   │   └── router.tsx                 # React Router setup
│   │
│   ├── .env.local                     # Local environment variables
│   ├── .env.example
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
│
├── backend/                           # Node.js backend API
│   ├── src/
│   │   ├── config/                    # Configuration files
│   │   │   ├── database.ts            # DB connection
│   │   │   ├── redis.ts               # Redis connection
│   │   │   ├── storage.ts             # S3/MinIO config
│   │   │   └── env.ts                 # Environment validation
│   │   │
│   │   ├── controllers/               # Route controllers
│   │   │   ├── auth.controller.ts
│   │   │   ├── projects.controller.ts
│   │   │   ├── alerts.controller.ts
│   │   │   ├── reports.controller.ts
│   │   │   ├── uploads.controller.ts
│   │   │   └── users.controller.ts
│   │   │
│   │   ├── services/                  # Business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── projects.service.ts
│   │   │   ├── alerts.service.ts
│   │   │   ├── anomaly.service.ts     # AI anomaly detection
│   │   │   ├── upload.service.ts
│   │   │   └── reports.service.ts
│   │   │
│   │   ├── models/                    # Database models (Prisma/TypeORM)
│   │   │   ├── User.ts
│   │   │   ├── Project.ts
│   │   │   ├── Alert.ts
│   │   │   ├── Evidence.ts
│   │   │   └── AuditLog.ts
│   │   │
│   │   ├── routes/                    # API routes
│   │   │   ├── index.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── projects.routes.ts
│   │   │   ├── alerts.routes.ts
│   │   │   ├── reports.routes.ts
│   │   │   ├── uploads.routes.ts
│   │   │   └── users.routes.ts
│   │   │
│   │   ├── middleware/                # Express middleware
│   │   │   ├── auth.middleware.ts     # JWT verification
│   │   │   ├── role.middleware.ts     # RBAC checks
│   │   │   ├── validation.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── upload.middleware.ts   # Multer config
│   │   │
│   │   ├── utils/                     # Utility functions
│   │   │   ├── jwt.util.ts
│   │   │   ├── bcrypt.util.ts
│   │   │   ├── logger.util.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── types/                     # TypeScript types
│   │   │   ├── express.d.ts          # Extend Express types
│   │   │   └── index.ts
│   │   │
│   │   ├── jobs/                      # Background jobs (BullMQ)
│   │   │   ├── process-upload.job.ts
│   │   │   ├── generate-thumbnail.job.ts
│   │   │   └── anomaly-detection.job.ts
│   │   │
│   │   ├── app.ts                     # Express app setup
│   │   └── server.ts                  # Server entry point
│   │
│   ├── prisma/                        # Prisma ORM (if using)
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── migrations/                    # DB migrations (if using TypeORM)
│   │   └── ...
│   │
│   ├── seeds/                         # Database seed files
│   │   ├── users.seed.ts
│   │   ├── projects.seed.ts
│   │   └── seed.ts
│   │
│   ├── tests/                         # Tests
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   │
│   ├── .env.example
│   ├── .env                           # Local environment (gitignored)
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
│
├── ai-service/                        # Python AI microservice
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # FastAPI app
│   │   ├── models/                    # ML models
│   │   │   ├── anomaly_detector.py
│   │   │   ├── image_analyzer.py
│   │   │   └── gps_validator.py
│   │   ├── services/
│   │   │   ├── detection_service.py
│   │   │   └── image_service.py
│   │   ├── api/
│   │   │   ├── routes.py
│   │   │   └── schemas.py
│   │   └── utils/
│   │       └── helpers.py
│   │
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   └── README.md
│
├── worker/                            # Background worker service (optional)
│   ├── src/
│   │   ├── workers/
│   │   │   ├── upload-processor.worker.ts
│   │   │   ├── thumbnail-generator.worker.ts
│   │   │   └── notification.worker.ts
│   │   └── index.ts
│   ├── package.json
│   └── Dockerfile
│
├── infra/                             # Infrastructure as Code
│   ├── docker/
│   │   ├── Dockerfile.frontend
│   │   ├── Dockerfile.backend
│   │   └── Dockerfile.ai-service
│   │
│   ├── docker-compose.yml            # Local development
│   ├── docker-compose.prod.yml      # Production
│   │
│   ├── kubernetes/                    # K8s manifests (optional)
│   │   ├── frontend-deployment.yaml
│   │   ├── backend-deployment.yaml
│   │   ├── services.yaml
│   │   └── ingress.yaml
│   │
│   └── terraform/                    # Terraform (optional)
│       └── ...
│
├── scripts/                           # Utility scripts
│   ├── setup-dev.sh                  # Initial dev setup
│   ├── seed-db.sh                     # Seed database
│   ├── create-admin.js                # Create admin user
│   ├── migrate-db.sh                  # Run migrations
│   └── backup-db.sh                   # Database backup
│
├── docs/                              # Documentation
│   ├── API.md                         # API documentation
│   ├── DEPLOYMENT.md                  # Deployment guide
│   ├── DEVELOPMENT.md                 # Development setup
│   ├── ARCHITECTURE.md                # Architecture details
│   └── DATABASE_SCHEMA.md             # Database schema
│
├── .github/
│   └── workflows/
│       ├── ci.yml                     # CI pipeline
│       └── deploy.yml                 # CD pipeline
│
├── .dockerignore
├── .gitignore
├── docker-compose.yml                 # Root docker-compose
├── README.md                          # Project README
└── LICENSE

```

---

## Key Configuration Files

### Root `docker-compose.yml`
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: nhm_fund_monitor
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data

  backend:
    build:
      context: ./backend
      dockerfile: ../infra/docker/Dockerfile.backend
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/nhm_fund_monitor
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      MINIO_ENDPOINT: minio
      MINIO_ACCESS_KEY: ${MINIO_ROOT_USER}
      MINIO_SECRET_KEY: ${MINIO_ROOT_PASSWORD}
    ports:
      - "5000:5000"
    depends_on:
      - postgres
      - redis
      - minio

  frontend:
    build:
      context: ./frontend
      dockerfile: ../infra/docker/Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: http://localhost:5000/api
    depends_on:
      - backend

  ai-service:
    build:
      context: ./ai-service
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      MODEL_PATH: /app/models
    depends_on:
      - backend

volumes:
  postgres_data:
  minio_data:
```

### Backend `.env.example`
```env
# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/nhm_fund_monitor

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Object Storage (MinIO/S3)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=nhm-evidence

# AI Service
AI_SERVICE_URL=http://localhost:8000

# CORS
CORS_ORIGIN=http://localhost:3000

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
```

### Frontend `.env.example`
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=NHM Fund Monitor
```

---

## API Contract Examples

### Authentication
```typescript
// POST /api/auth/login
{
  email: string;
  password: string;
  role: 'admin' | 'district_officer' | 'auditor';
}

// Response
{
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    district?: string;
  }
}
```

### Projects
```typescript
// GET /api/projects
// GET /api/projects/:id
// POST /api/projects
// PUT /api/projects/:id
// DELETE /api/projects/:id

// Response
{
  id: string;
  name: string;
  district: string;
  budget: number;
  amountUsed: number;
  status: 'active' | 'completed' | 'pending';
  milestones: Milestone[];
  evidence: Evidence[];
}
```

### Uploads
```typescript
// POST /api/uploads/evidence
// FormData: file, projectId, milestoneId, gps, notes

// Response
{
  id: string;
  url: string;
  thumbnailUrl: string;
  gps: { lat: number; lng: number };
  timestamp: string;
  anomalyDetected?: boolean;
}
```

---

## Quick Start Commands

```bash
# Clone repository
git clone <repo-url>
cd nhm-fund-monitor

# Start all services with Docker
docker-compose up -d

# Or run locally
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev

# Setup database
npm run migrate
npm run seed

# Create admin user
node scripts/create-admin.js
```

---

## Security Checklist

- [ ] Environment variables for all secrets
- [ ] JWT tokens with expiration
- [ ] Role-based access control (RBAC)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] File upload validation (type, size limits)
- [ ] CORS configuration
- [ ] Rate limiting
- [ ] HTTPS in production
- [ ] Audit logging for sensitive actions

---

## Next Steps

1. Initialize each service with its framework
2. Set up database schema and migrations
3. Implement authentication flow
4. Build API endpoints
5. Connect frontend to backend
6. Add AI service integration
7. Set up CI/CD pipeline
8. Deploy to staging/production

---

This architecture is production-ready and can scale as needed. Start with the core features and add services incrementally.

