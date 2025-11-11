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

// MongoDB connection (only if MONGO_URI is provided)
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
} else {
  console.log('No MONGO_URI provided, running without database');
}

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reservation', require('./routes/reservation'));
app.use('/api/apikey', require('./routes/apikey'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/table', require('./routes/table'));
app.use('/api/places', require('./routes/places'));
app.use('/api/geo', require('./routes/geo'));
app.use('/api/restaurants', require('./routes/restaurants'));

// Serve React App in Production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from React build
  app.use(express.static(path.join(__dirname, '../frontend-app/build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend-app/build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Live Table Reservation System API',
      frontend: 'Run frontend separately in development',
      endpoints: [
        '/api/auth',
        '/api/reservation', 
        '/api/restaurants',
        '/api/places',
        '/api/table'
      ]
    });
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;