export const renderLogin = (req, res) => {
  res.render('auth/login', { 
    error: req.query.error 
  });
};

export const renderRegister = (req, res) => {
  res.render('auth/register');
};