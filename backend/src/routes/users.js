import express from 'express';
import User from '../models/User.js';
import Image from '../models/Image.js';

const router = express.Router();

router.post('/register-user', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: 'User not found' });
  }
});

router.get('/leaderboard', async (_req, res) => {
  const users = await User.find().sort({ tokens: -1 }).limit(10);
  res.json(users.map(u => ({ id: u._id, name: u.name, tokens: u.tokens })));
});

router.get('/creator-stats/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const totalImages = await Image.countDocuments({ userId: req.params.id });
    res.json({
      id: user._id,
      name: user.name,
      tokens: user.tokens,
      badges: user.badges,
      totalImages,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
