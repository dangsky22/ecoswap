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