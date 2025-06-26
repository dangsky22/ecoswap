import dotenv from 'dotenv';
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecoswap';
export const PORT = parseInt(process.env.PORT, 10) || 3000;
export const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';