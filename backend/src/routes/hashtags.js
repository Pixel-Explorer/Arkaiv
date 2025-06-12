import express from 'express';
import Hashtag from '../models/Hashtag.js';
import Image from '../models/Image.js';

const router = express.Router();

router.get('/hashtags', async (_req, res) => {
  const tags = await Hashtag.find();
  res.json(tags);
});

router.post('/hashtags', async (req, res) => {
  try {
    const tag = await Hashtag.create({ tag: req.body.tag, weight: req.body.weight });
    res.json(tag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/images/:imageId/hashtags/:hashtagId', async (req, res) => {
  const { imageId, hashtagId } = req.params;
  try {
    const image = await Image.findByIdAndUpdate(
      imageId,
      { $addToSet: { hashtags: hashtagId } },
      { new: true }
    );
    res.json(image);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/images/:imageId/hashtags/:hashtagId', async (req, res) => {
  const { imageId, hashtagId } = req.params;
  try {
    const image = await Image.findByIdAndUpdate(
      imageId,
      { $pull: { hashtags: hashtagId } },
      { new: true }
    );
    res.json(image);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/hashtags/:hashtagId/images', async (req, res) => {
  const { hashtagId } = req.params;
  try {
    const images = await Image.find({ hashtags: hashtagId }).sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
