import mongoose from 'mongoose';
import app from './app.js';
import { MONGODB_URI, PORT } from './config/db.js';

const startServer = async () => {
  try {
    // Connection options for MongoDB Atlas
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    
    await mongoose.connect(MONGODB_URI, options);
    console.log('✅ Terhubung ke MongoDB Atlas');

    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
      console.log('📝 Available routes:');
      console.log('   - GET /                  (Home)');
      console.log('   - GET /login             (Login Page)');
      console.log('   - GET /register          (Register Page)');
      console.log('   - GET /dashboard         (Dashboard - Protected)');
      console.log('   - POST /auth/login       (Login API)');
      console.log('   - POST /auth/register    (Register API)');
      console.log('   - GET /auth/google       (Google OAuth)');
      console.log('   - GET /auth/google/callback (OAuth Callback)');
    });
  } catch (err) {
    console.error('❌ Gagal terhubung ke MongoDB:', err);
    process.exit(1);
  }
};

startServer();