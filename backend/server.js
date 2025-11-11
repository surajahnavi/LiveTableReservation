const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Simple logging middleware for debugging
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reservation', require('./routes/reservation'));
app.use('/api/apikey', require('./routes/apikey'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/table', require('./routes/table'));
app.use('/api/places', require('./routes/places'));
app.use('/api/geo', require('./routes/geo'));
app.use('/api/restaurants', require('./routes/restaurants')); // New enhanced restaurant API

app.get('/', (req, res) => {
  res.send('Live Table Reservation System API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
