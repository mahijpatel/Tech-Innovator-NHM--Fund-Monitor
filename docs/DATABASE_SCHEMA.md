# NHM Fund Monitor - Database Schema

## Entity Relationship Diagram

```
Users ──┬── Projects ──┬── Milestones
        │              │
        │              └── Evidence
        │
        └── Alerts ────┴── Projects

AuditLogs (tracks all user actions)
```

---

## Tables

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'district_officer', 'auditor')),
  district VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_district ON users(district);
```

### projects
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  district VARCHAR(255) NOT NULL,
  budget DECIMAL(15, 2) NOT NULL,
  amount_used DECIMAL(15, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  gps_latitude DECIMAL(10, 8),
  gps_longitude DECIMAL(11, 8),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_district ON projects(district);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_by ON projects(created_by);
```

### milestones
```sql
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  expected_date DATE NOT NULL,
  actual_date DATE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_milestones_project ON milestones(project_id);
CREATE INDEX idx_milestones_status ON milestones(status);
```

### evidence
```sql
CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
  uploaded_by UUID NOT NULL REFERENCES users(id),
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_type VARCHAR(20) NOT NULL CHECK (file_type IN ('image', 'video')),
  file_size BIGINT,
  gps_latitude DECIMAL(10, 8),
  gps_longitude DECIMAL(11, 8),
  progress_percentage INTEGER CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  notes TEXT,
  anomaly_detected BOOLEAN DEFAULT FALSE,
  anomaly_type VARCHAR(100),
  anomaly_severity VARCHAR(20) CHECK (anomaly_severity IN ('critical', 'warning')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_evidence_project ON evidence(project_id);
CREATE INDEX idx_evidence_uploaded_by ON evidence(uploaded_by);
CREATE INDEX idx_evidence_anomaly ON evidence(anomaly_detected);
```

### alerts
```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL CHECK (type IN ('ai_anomaly', 'delay', 'spend', 'evidence', 'manual')),
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  evidence_id UUID REFERENCES evidence(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'dismissed')),
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_type ON alerts(type);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_project ON alerts(project_id);
```

### audit_logs
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

### reports
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  format VARCHAR(20) NOT NULL CHECK (format IN ('pdf', 'excel', 'csv')),
  file_url TEXT NOT NULL,
  parameters JSONB,
  generated_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reports_type ON reports(type);
CREATE INDEX idx_reports_generated_by ON reports(generated_by);
CREATE INDEX idx_reports_created ON reports(created_at);
```

### settings
```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  user_id UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_user ON settings(user_id);
```

---

## Sample Seed Data

### Users
```sql
INSERT INTO users (name, email, password_hash, role, district) VALUES
  ('Admin User', 'admin@nhm.gov.in', '$2b$10$...', 'admin', NULL),
  ('District Officer A', 'do.a@nhm.gov.in', '$2b$10$...', 'district_officer', 'District A'),
  ('Field Auditor 1', 'auditor1@nhm.gov.in', '$2b$10$...', 'auditor', NULL);
```

### Projects
```sql
INSERT INTO projects (name, district, budget, status, start_date, end_date) VALUES
  ('Primary Health Center - Renovation', 'District A', 850000, 'active', '2024-01-01', '2024-06-30'),
  ('Maternal Health Program', 'District B', 1200000, 'active', '2024-01-15', '2024-12-31');
```

---

## Database Migrations

Use Prisma or TypeORM for migrations:

```bash
# Prisma
npx prisma migrate dev --name init

# TypeORM
npm run migration:run
```

---

## Backup Strategy

```bash
# Daily backup script
pg_dump -U postgres nhm_fund_monitor > backup_$(date +%Y%m%d).sql

# Restore
psql -U postgres nhm_fund_monitor < backup_20240115.sql
```

---

## Performance Optimization

1. **Indexes**: Already defined on frequently queried columns
2. **Partitioning**: Consider partitioning `audit_logs` by date
3. **Archiving**: Archive old audit logs (>1 year) to cold storage
4. **Caching**: Use Redis for frequently accessed data
5. **Connection Pooling**: Configure pgBouncer for production

