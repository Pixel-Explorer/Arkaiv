import express from 'express';
import multer from 'multer';
import { Storage } from 'firebase-admin/storage';
import Image from '../models/Image.js';
import User from '../models/User.js';
import { extractEV } from '../utils/ev.js';
import { rewardTokens } from '../utils/token.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-image', authenticate, upload.single('file'), async (req, res) => {
  try {
    const bucket = new Storage().bucket();
    const file = bucket.file(Date.now() + '-' + req.file.originalname);
    await file.save(req.file.buffer, { contentType: req.file.mimetype });

    const ev = extractEV(req.file.buffer);

    const user = await User.findOne({ supabaseId: req.user.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const image = await Image.create({
      userId: user._id,
      ev,
      storagePath: file.name,
    });
    res.json(image);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/feed', async (req, res) => {
  const images = await Image.find().sort({ createdAt: -1 }).limit(20);
  res.json(images);
});

export default router;
