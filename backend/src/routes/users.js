import express from 'express';
import User from '../models/User.js';
import TokenLedger from '../models/TokenLedger.js';

const router = express.Router();

router.post('/register-user', async (req, res) => {
  try {
    const { email, name, supabaseId } = req.body;
    const user = await User.create({ email, name, supabaseId });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findOne({ supabaseId: req.params.id });
    if (!user) throw new Error('User not found');
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: 'User not found' });
  }
});

router.get('/creator-stats/:id', async (req, res) => {
  try {
    const user = await User.findOne({ supabaseId: req.params.id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const result = await TokenLedger.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: '$userId', tokens: { $sum: '$tokens' } } },
    ]);

    const transactions = await TokenLedger.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      supabaseId: user.supabaseId,
      totalTokens: result[0]?.tokens || 0,
      transactions,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Placeholder endpoint for planned archive feature
router.get('/archive', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

export default router;
