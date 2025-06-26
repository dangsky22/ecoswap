import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.model.js';
import dotenv from 'dotenv';

dotenv.config();

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && 
    process.env.GOOGLE_CLIENT_SECRET && 
    process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here') {
  
  console.log('✅ Initializing Google OAuth strategy...');
  
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'

  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('🔍 Google OAuth callback received for:', profile.displayName);
      
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        // Check if user exists with this email
        const existingUser = await User.findOne({ email: profile.emails[0].value });
        
        if (existingUser) {
          // Link Google account to existing user
          existingUser.googleId = profile.id;
          await existingUser.save();
          user = existingUser;
        } else {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            role: 'user'
          });
          console.log('✨ Created new user from Google profile:', user.email);
        }
      } else {
        console.log('👤 Existing Google user found:', user.email);
      }
      
      return done(null, user);
    } catch (error) {
      console.error('❌ Google OAuth error:', error);
      return done(error, null);
    }
  }));
  
  console.log('✅ Google OAuth strategy configured successfully');
} else {
  console.log('⚠️  Google OAuth not configured - credentials missing or invalid');
}

passport.serializeUser((user, done) => {
  console.log('📝 Serializing user:', user._id);
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error('❌ Deserialize error:', error);
    done(error, null);
  }
});

export default passport;