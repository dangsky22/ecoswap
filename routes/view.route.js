import { Router } from 'express';
import { renderHome, renderLogin, renderRegister, renderDashboard } from '../controllers/view.controller.js';
import { authenticateToken, redirectIfAuthenticated } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', renderHome);
router.get('/login', redirectIfAuthenticated, renderLogin);
router.get('/register', redirectIfAuthenticated, renderRegister);

// Protected routes
router.get('/dashboard', authenticateToken, renderDashboard);

export default router;