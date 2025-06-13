import express from 'express';
import multer from 'multer';
import { Storage } from 'firebase-admin/storage';
import Image from '../models/Image.js';
import TokenLedger from '../models/TokenLedger.js';
import User from '../models/User.js';
import { extractEV } from '../utils/ev.js';
import { rewardTokens } from '../utils/token.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const SUPPORTED_MIME_REGEX = /^image\//;

router.post('/upload-image', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }
    if (!SUPPORTED_MIME_REGEX.test(req.file.mimetype)) {
      return res.status(400).json({ error: 'Unsupported MIME type' });
    }
    const bucket = new Storage().bucket();
    const file = bucket.file(Date.now() + '-' + req.file.originalname);
    await file.save(req.file.buffer, { contentType: req.file.mimetype });
    let publicUrl = '';
    if (typeof file.getSignedUrl === 'function') {
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      publicUrl = url;
    }

    const ev = extractEV(req.file.buffer);
    const tokens = rewardTokens(ev);

    const userDoc = await User.findOne({ supabaseId: req.user.id });
    if (!userDoc) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userId = userDoc._id;

    const image = await Image.create({
      userId,
      ev,
      storagePath: file.name,
      publicUrl,
    });

    await TokenLedger.create({
      userId,
      imageId: image._id,
      tokens,
    });

    res.json({ image, tokens });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/feed', async (req, res) => {
  const images = await Image.find().sort({ createdAt: -1 }).limit(20);
  res.json(images);
});

export default router;
