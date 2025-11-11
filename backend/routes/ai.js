const express = require('express');
const Table = require('../models/Table');
const auth = require('../middleware/auth');

const router = express.Router();

// AI-powered smart table suggestion
router.post('/suggest', auth, async (req, res) => {
  const { guests, date, time } = req.body;
  try {
    // Find available tables with enough seats
    const tables = await Table.find({ status: 'available', seats: { $gte: guests } });
    if (tables.length === 0) {
      return res.status(404).json({ msg: 'No suitable tables available' });
    }
    // Simple agentic logic: pick the table with the least extra seats
    const bestTable = tables.reduce((prev, curr) =>
      (curr.seats - guests < prev.seats - guests ? curr : prev)
    );
    res.json({ suggestion: bestTable });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
