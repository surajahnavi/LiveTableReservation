const express = require('express');
const Table = require('../models/Table');
const router = express.Router();

// Seed tables (for demo)
router.post('/seed', async (req, res) => {
  try {
    const tables = [];
    for (let i = 1; i <= 10; i++) {
      tables.push({ number: i, seats: 4 });
    }
    await Table.insertMany(tables);
    res.json({ msg: 'Tables seeded' });
  } catch (err) {
    res.status(500).json({ msg: 'Error seeding tables' });
  }
});

module.exports = router;
