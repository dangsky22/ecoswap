import { Router } from 'express';
import { login, generateJWT } from '../controllers/auth.controller.js';
import passport from 'passport';

const router = Router();

// Local login
router.post('/login', login);

// Google OAuth
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  prompt: 'select_account' // Forces account selection
}));

// Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false 
  }),
  (req, res) => {
    try {
      const token = generateJWT(req.user);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/auth-success?token=${token}`);
    } catch (error) {
      console.error('Error generating token:', error);
      res.redirect('/login?error=auth_failed');
    }
  }
);

export default router;