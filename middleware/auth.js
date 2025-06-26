import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { JWT_SECRET } from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const authenticateToken = async (req, res, next) => {
  try {
    // First check if user is logged in via session (OAuth)
    if (req.isAuthenticated && req.isAuthenticated()) {
      console.log('✅ User authenticated via session:', req.user.email);
      return next();
    }

    // Then check for JWT token in various places
    let token;
    
    if (req.query.token) {
      token = req.query.token;
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) {
          return res.redirect('/login?error=user_not_found');
        }
        
        req.user = user;
        console.log('✅ User authenticated via JWT:', user.email);
        return next();
      } catch (err) {
        console.error('❌ JWT verification error:', err);
        return res.redirect('/login?error=invalid_token');
      }
    }

    // No authentication found
    console.log('❌ No authentication found, redirecting to login');
    return res.redirect('/login?error=no_auth');

  } catch (error) {
    console.error('❌ Authentication middleware error:', error);
    res.redirect('/login?error=auth_error');
  }
};

// Middleware to check if user is NOT authenticated (for login/register pages)
export const redirectIfAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.redirect('/dashboard');
  }
  
  // Check JWT token
  let token;
  if (req.query.token || req.cookies?.token) {
    token = req.query.token || req.cookies.token;
    try {
      jwt.verify(token, JWT_SECRET);
      return res.redirect('/dashboard');
    } catch (err) {
      // Invalid token, continue to login/register
    }
  }
  
  next();
};