import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { JWT_SECRET } from '../config/db.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    console.log('📝 Registration attempt for:', email);

    // Validasi input
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ 
        error: 'Semua field harus diisi' 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        error: 'Password dan konfirmasi password tidak cocok' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password minimal 6 karakter' 
      });
    }

    // Cek apakah email sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Email sudah terdaftar' 
      });
    }

    // Buat user baru
    const user = new User({
      name,
      email,
      password,
      role: role || 'user'
    });

    await user.save();
    console.log('✅ User registered successfully:', email);

    // Login user automatically after registration
    req.login(user, (err) => {
      if (err) {
        console.error('Auto-login error:', err);
        return res.status(500).json({ error: 'Registrasi berhasil tapi gagal login otomatis' });
      }

      // Generate token for frontend
      const token = generateJWT(user);
      
      res.status(201).json({ 
        message: 'Registrasi berhasil',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });

  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan server' 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Login attempt for:', email);

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email dan password harus diisi' 
      });
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Email atau password salah' 
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Email atau password salah' 
      });
    }

    console.log('✅ Login successful for:', email);

    // Login user with session
    req.login(user, (err) => {
      if (err) {
        console.error('Session login error:', err);
        return res.status(500).json({ error: 'Login berhasil tapi gagal membuat session' });
      }

      const token = generateJWT(user);
      
      res.json({ 
        message: 'Login berhasil',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan server' 
    });
  }
};

export const googleAuth = (req, res) => {
  try {
    console.log('🔗 Google OAuth success for:', req.user.email);
    const token = generateJWT(req.user);
    res.redirect(`/dashboard?token=${token}&success=oauth_login`);
  } catch (error) {
    console.error('❌ Google auth error:', error);
    res.redirect('/login?error=oauth_failed');
  }
};

export const generateJWT = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email,
      name: user.name,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};