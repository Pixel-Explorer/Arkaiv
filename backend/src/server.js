import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import mongoose from 'mongoose';
import fs from 'fs';

import userRoutes from './routes/users.js';
import imageRoutes from './routes/images.js';

dotenv.config();

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
