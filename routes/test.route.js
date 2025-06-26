import { Router } from 'express';
import passport from '../config/passport.js';

const router = Router();

// Test route to check OAuth configuration
router.get('/oauth-status', (req, res) => {
  const hasGoogleStrategy = passport._strategies && passport._strategies.google;
  
  res.json({
    googleOAuthConfigured: !!hasGoogleStrategy,
    environment: {
      clientIdSet: !!process.env.GOOGLE_CLIENT_ID,
      clientSecretSet: !!process.env.GOOGLE_CLIENT_SECRET,
      callbackUrlSet: !!process.env.GOOGLE_CALLBACK_URL,
      mongoConnected: true 
    },
    callbackUrl: process.env.GOOGLE_CALLBACK_URL
  });
});

export default router;
