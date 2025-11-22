# NHM Fund Monitor - API Documentation

Base URL: `http://localhost:5000/api` (development)  
Authentication: Bearer Token (JWT)

---

## Authentication Endpoints

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@nhm.gov.in",
  "password": "password123",
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@nhm.gov.in",
    "role": "admin",
    "district": null
  }
}
```

### Refresh Token
```http
POST /api/auth/refresh
Authorization: Bearer <token>
```

### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

---

## Projects Endpoints

### Get All Projects
```http
GET /api/projects
Authorization: Bearer <token>
Query Params:
  - district?: string
  - status?: 'active' | 'completed' | 'pending'
  - page?: number
  - limit?: number
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Primary Health Center - Renovation",
      "district": "District A",
      "budget": 850000,
      "amountUsed": 620000,
      "status": "active",
      "progress": 73,
      "milestones": [...],
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

### Get Project by ID
```http
GET /api/projects/:id
Authorization: Bearer <token>
```

### Create Project (Admin only)
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Project",
  "district": "District A",
  "budget": 1000000,
  "description": "Project description",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

### Update Project
```http
PUT /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Project Name",
  "budget": 1200000
}
```

### Delete Project (Admin only)
```http
DELETE /api/projects/:id
Authorization: Bearer <token>
```

---

## Evidence/Upload Endpoints

### Upload Evidence
```http
POST /api/uploads/evidence
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - file: File (image/video)
  - projectId: string
  - milestoneId?: string
  - progress: number (0-100)
  - notes?: string
  - gpsLat?: number
  - gpsLng?: number
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "https://storage.../evidence.jpg",
    "thumbnailUrl": "https://storage.../thumb.jpg",
    "type": "image",
    "gps": {
      "lat": 28.6139,
      "lng": 77.2090
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "anomalyDetected": false,
    "anomalyType": null
  }
}
```

### Get Evidence by Project
```http
GET /api/uploads/project/:projectId
Authorization: Bearer <token>
```

### Delete Evidence
```http
DELETE /api/uploads/:id
Authorization: Bearer <token>
```

---

## Alerts Endpoints

### Get All Alerts
```http
GET /api/alerts
Authorization: Bearer <token>
Query Params:
  - type?: 'ai_anomaly' | 'delay' | 'spend' | 'evidence'
  - severity?: 'critical' | 'warning'
  - status?: 'open' | 'resolved'
  - district?: string
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "ai_anomaly",
      "severity": "critical",
      "title": "Low Physical Progress",
      "description": "Project shows 60% fund utilization but only 35% physical progress",
      "projectId": "uuid",
      "projectName": "Primary Health Center",
      "status": "open",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Mark Alert as Resolved
```http
PUT /api/alerts/:id/resolve
Authorization: Bearer <token>
```

### Create Manual Alert
```http
POST /api/alerts
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "delay",
  "severity": "warning",
  "title": "Milestone Delay",
  "description": "Milestone deadline exceeded",
  "projectId": "uuid"
}
```

---

## Reports Endpoints

### Generate Report
```http
POST /api/reports/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "district_utilization" | "fund_allocation" | "project_progress" | "alerts_summary",
  "district": "District A",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "format": "pdf" | "excel"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reportId": "uuid",
    "downloadUrl": "https://storage.../report.pdf",
    "generatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### Get Report History
```http
GET /api/reports
Authorization: Bearer <token>
```

---

## Users Endpoints (Admin only)

### Get All Users
```http
GET /api/users
Authorization: Bearer <token>
```

### Create User
```http
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New User",
  "email": "user@nhm.gov.in",
  "password": "password123",
  "role": "district_officer",
  "district": "District A"
}
```

### Update User
```http
PUT /api/users/:id
Authorization: Bearer <token>
```

### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <token>
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": "Email is required"
    }
  }
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

- Authentication endpoints: 5 requests per minute
- Upload endpoints: 10 requests per minute
- Other endpoints: 100 requests per minute

---

## WebSocket Events (Optional)

For real-time updates:

```javascript
// Connect
const ws = new WebSocket('ws://localhost:5000/ws');

// Listen for alerts
ws.on('alert', (data) => {
  console.log('New alert:', data);
});

// Listen for project updates
ws.on('project_update', (data) => {
  console.log('Project updated:', data);
});
```

