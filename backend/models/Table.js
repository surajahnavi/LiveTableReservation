const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  seats: { type: Number, required: true },
  status: { type: String, enum: ['available', 'reserved'], default: 'available' }
});

module.exports = mongoose.model('Table', tableSchema);
