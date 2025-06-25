import mongoose from 'mongoose';
import app from './app.js';
import { MONGODB_URI, PORT } from './config/db.js';

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Terhubung ke MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Gagal terhubung ke MongoDB:', err);
    process.exit(1);
  }
};

startServer();