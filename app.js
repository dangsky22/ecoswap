import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import { fileURLToPath } from 'url';
import './config/passport.js';
import authRoute from './routes/auth.route.js';
import viewRoute from './routes/view.route.js';
import { JWT_SECRET } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust proxy for Heroku/cloud deployment
app.set('trust proxy', 1);

// Middleware
app.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost:5173'], 
  credentials: true 
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// EJS Setup
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

// Routes
app.use('/auth', authRoute);
app.use('/', viewRoute);

// 404 Handler - catch all routes not matched above
app.use((req, res) => {
    res.status(404).render('error', { 
        title: '404 - Halaman Tidak Ditemukan',
        error: '404',
        message: 'Halaman yang Anda cari tidak ditemukan.',
        layout: 'layouts/main'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        title: '500 - Server Error',
        error: '500',
        message: 'Terjadi kesalahan pada server.',
        layout: 'layouts/main'
    });
});

export default app;