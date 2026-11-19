import mongoose from 'mongoose';
import { config } from './config.js';

export async function connectDB() {
  if (!config.mongoUri) {
    throw new Error(
      'MONGODB_URI is not configured. Copy server/.env.example to server/.env and set it.',
    );
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(config.mongoUri);
  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
