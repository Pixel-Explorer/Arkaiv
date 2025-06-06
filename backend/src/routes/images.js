import express from 'express';
import multer from 'multer';
import { Storage } from 'firebase-admin/storage';
import Image from '../models/Image.js';
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
    const image = await Image.create({
      userId: req.body.userId,
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
