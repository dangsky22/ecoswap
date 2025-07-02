
import User from '../models/User.model.js';

// Tampilkan daftar pengelola (waste_manager)
export const renderCariPengelola = async (req, res) => {
  try {
    const pengelola = await User.find({ role: 'waste_manager' }, 'name email profile');
    res.render('cari-pengelola', {
      title: 'Cari Pengelola - EcoSwap',
      user: req.user,
      pengelola
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      error: '500',
      message: 'Gagal memuat data pengelola',
      layout: 'layouts/main'
    });
  }
};
export const renderEdukasi = (req, res) => {
  res.render('layouts/edukasi', {
    title: 'Edukasi - EcoSwap',
    user: req.user
  });
};
export const renderHome = (req, res) => {
  res.render('home', { 
    title: 'EcoSwap - Platform Tukar Sampah Digital'
  });
};

export const renderLogin = (req, res) => {
  res.render('auth/login', { 
    title: 'Login - EcoSwap',
    error: req.query.error,
    success: req.query.success
  });
};

export const renderRegister = (req, res) => {
  res.render('auth/register', {
    title: 'Register - EcoSwap',
    error: req.query.error
  });
};

export const renderDashboard = (req, res) => {
  // Middleware auth akan menambahkan user ke req
  res.render('dashboard', {
    title: 'Dashboard - EcoSwap',
    user: req.user,
    success: req.query.success
  });
};