import express from 'express';
import multer from 'multer';
import { Storage } from 'firebase-admin/storage';
import Image from '../models/Image.js';
import User from '../models/User.js';
import { extractEV } from '../utils/ev.js';
import { rewardTokens } from '../utils/token.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-image', upload.single('file'), async (req, res) => {
  try {
    const bucket = new Storage().bucket();
    const file = bucket.file(Date.now() + '-' + req.file.originalname);
    await file.save(req.file.buffer, { contentType: req.file.mimetype });

    const ev = extractEV(req.file.buffer);
    const position = await Image.countDocuments() + 1;
    const tokens = rewardTokens(ev, position);
    const image = await Image.create({
      userId: req.body.userId,
      ev,
      storagePath: file.name,
      tokens,
    });

    const user = await User.findById(req.body.userId);
    if (user) {
      user.tokens += tokens;
      if (user.tokens >= 100 && !user.badges.includes('Contributor')) {
        user.badges.push('Contributor');
      }
      await user.save();
    }

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
