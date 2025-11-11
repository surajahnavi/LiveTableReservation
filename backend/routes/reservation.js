const express = require('express');
const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const auth = require('../middleware/auth');

const router = express.Router();

// Book a table
router.post('/book', auth, async (req, res) => {
  const { tableNumber, date, time, guests } = req.body;
  try {
    const table = await Table.findOne({ number: tableNumber });
    if (!table || table.status === 'reserved') {
      return res.status(400).json({ msg: 'Table not available' });
    }
    table.status = 'reserved';
    await table.save();
    const reservation = new Reservation({
      user: req.user.id,
      tableNumber,
      date,
      time,
      guests
    });
    await reservation.save();
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all reservations for user
router.get('/my', auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// List available tables
router.get('/tables', async (req, res) => {
  try {
    const tables = await Table.find({ status: 'available' });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
