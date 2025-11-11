const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const crypto = require('crypto');

const router = express.Router();

// Generate API key
router.post('/generate', auth, async (req, res) => {
  try {
    const apiKey = crypto.randomBytes(32).toString('hex');
    await User.findByIdAndUpdate(req.user.id, { apiKey });
    res.json({ apiKey });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get API key
router.get('/key', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ apiKey: user.apiKey });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
