import { Router } from 'express';
import { renderHome, renderLogin, renderRegister, renderDashboard, renderEdukasi } from '../controllers/view.controller.js';
import { authenticateToken, redirectIfAuthenticated } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', renderHome);
router.get('/login', redirectIfAuthenticated, renderLogin);
router.get('/register', redirectIfAuthenticated, renderRegister);

// Edukasi page (public)
router.get('/edukasi', renderEdukasi);

// Protected routes
router.get('/dashboard', authenticateToken, renderDashboard);

import { renderCariPengelola } from '../controllers/view.controller.js';
router.get('/cari-pengelola', authenticateToken, renderCariPengelola);

export default router;