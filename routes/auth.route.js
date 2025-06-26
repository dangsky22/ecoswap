import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js';
import passport from 'passport';
import '../config/passport.js'; // Ensure passport config is loaded

const router = Router();

// Local authentication
router.post('/register', register);
router.post('/login', login);

// Google OAuth routes
router.get('/google', (req, res, next) => {
  console.log('🚀 Google OAuth route accessed');
  next();
}, passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

router.get('/google/callback', (req, res, next) => {
  console.log('🔄 Google OAuth callback accessed');
  next();
}, passport.authenticate('google', { 
    failureRedirect: '/login?error=oauth_failed',
    successRedirect: '/dashboard?success=oauth_login'
  })
);

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logout berhasil' });
    });
  });
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
      res.clearCookie('connect.sid');
      res.redirect('/login?success=logout');
    });
  });
});

export default router;