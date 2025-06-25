import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { JWT_SECRET } from '../config/db.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Email atau password salah' });
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

export const googleAuth = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, JWT_SECRET);
  res.redirect(`http://localhost:3000/auth-success?token=${token}`);
};

export const generateJWT = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};