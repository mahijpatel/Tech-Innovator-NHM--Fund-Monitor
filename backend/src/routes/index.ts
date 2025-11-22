import { Router, Request, Response } from 'express';

const router = Router();

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Authentication (placeholder) - matches POST /api/auth/login contract
router.post('/auth/login', (req: Request, res: Response) => {
  const { email, role } = req.body;

  // TODO: validate password, check user in DB, issue real JWT
  return res.json({
    token: 'demo-token',
    user: {
      id: 'demo-user',
      name: 'Demo User',
      email,
      role,
    },
  });
});

// Example projects endpoint - matches GET /api/projects contract at a basic level
router.get('/projects', (req: Request, res: Response) => {
  const projects = [
    {
      id: '1',
      name: 'Primary Health Centre Upgrade',
      district: 'Sample District',
      budget: 1000000,
      amountUsed: 250000,
      status: 'active',
      milestones: [],
      evidence: [],
    },
  ];

  return res.json(projects);
});

export default router;
