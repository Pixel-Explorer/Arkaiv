import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import mongoose from 'mongoose';
import fs from 'fs';

import userRoutes from './routes/users.js';
import imageRoutes from './routes/images.js';

dotenv.config();

const requiredVars = [
  'MONGODB_URI',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'FIREBASE_SERVICE_ACCOUNT_PATH',
  'FIREBASE_STORAGE_BUCKET'
];
const missing = requiredVars.filter((v) => !process.env[v]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
if (serviceAccount && fs.existsSync(serviceAccount)) {
  initializeApp({
    credential: cert(JSON.parse(fs.readFileSync(serviceAccount, 'utf-8'))),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

mongoose.connect(process.env.MONGODB_URI);

app.use('/api', userRoutes);
app.use('/api', imageRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
