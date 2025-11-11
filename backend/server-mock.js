const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Simple logging middleware for debugging
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Simple in-memory user storage (for demo purposes)
const users = [];
const reservations = [];

// Email configuration (using Gmail as an example)
// For production, use environment variables for credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-app-email@gmail.com', // Replace with your app's email
    pass: process.env.EMAIL_PASS || 'your-app-password' // Replace with app password
  }
});

// For development/demo purposes, we'll simulate email sending
const sendConfirmationEmail = async (customerEmail, reservationDetails) => {
  const emailContent = {
    from: process.env.EMAIL_USER || 'your-app-email@gmail.com',
    to: customerEmail,
    subject: 'Table Reservation Confirmation - ' + reservationDetails.restaurant.name,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2196F3; border-bottom: 2px solid #2196F3; padding-bottom: 10px;">
          🍽️ Reservation Confirmed!
        </h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Booking Details</h3>
          <p><strong>Restaurant:</strong> ${reservationDetails.restaurant.name}</p>
          <p><strong>Address:</strong> ${reservationDetails.restaurant.vicinity}</p>
          ${reservationDetails.table ? `
            <p><strong>Table:</strong> ${reservationDetails.table.number} (${reservationDetails.table.location})</p>
            <p><strong>Table Capacity:</strong> ${reservationDetails.table.capacity} people</p>
            ${reservationDetails.table.price > 0 ? `<p><strong>Premium Charge:</strong> $${reservationDetails.table.price}</p>` : ''}
          ` : ''}
          <p><strong>Date:</strong> ${reservationDetails.booking.date}</p>
          <p><strong>Time:</strong> ${reservationDetails.booking.time}</p>
          <p><strong>Guests:</strong> ${reservationDetails.booking.guests} people</p>
          <p><strong>Confirmation ID:</strong> ${reservationDetails.confirmationId}</p>
        </div>

        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #4caf50;">
          <h4 style="margin-top: 0; color: #2e7d32;">Customer Information</h4>
          <p><strong>Name:</strong> ${reservationDetails.booking.customerName}</p>
          <p><strong>Phone:</strong> ${reservationDetails.booking.customerPhone}</p>
          <p><strong>Email:</strong> ${reservationDetails.booking.customerEmail}</p>
        </div>

        ${reservationDetails.booking.specialRequests ? `
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #856404;">Special Requests</h4>
            <p>${reservationDetails.booking.specialRequests}</p>
          </div>
        ` : ''}

        <div style="margin: 30px 0; padding: 20px; background: #f0f4ff; border-radius: 8px;">
          <h4 style="margin-top: 0; color: #1976d2;">Important Information</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Please arrive 10 minutes before your reservation time</li>
            <li>If you need to cancel or modify, please call the restaurant</li>
            <li>Restaurant Phone: ${reservationDetails.restaurant.phone || 'Contact restaurant directly'}</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">
            Thank you for choosing ${reservationDetails.restaurant.name}!<br>
            We look forward to serving you.
          </p>
        </div>

        <div style="text-align: center; padding: 20px; background: #f5f5f5; border-radius: 8px; margin-top: 30px;">
          <p style="color: #888; font-size: 12px; margin: 0;">
            This is an automated confirmation email. Please do not reply.<br>
            For any inquiries, please contact the restaurant directly.
          </p>
        </div>
      </div>
    `
  };

  try {
    // For development, we'll just log the email content instead of actually sending
    console.log('📧 Reservation Confirmation Email (simulated):');
    console.log('To:', customerEmail);
    console.log('Subject:', emailContent.subject);
    console.log('Confirmation ID:', reservationDetails.confirmationId);
    
    // Uncomment the line below to actually send emails (requires valid email credentials)
    // await transporter.sendMail(emailContent);
    
    return { success: true, message: 'Confirmation email sent successfully' };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, message: 'Failed to send confirmation email' };
  }
};

// Mock Authentication Routes
app.post('/api/auth/register', (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password } = req.body;
    
    // Enhanced validation
    if (!name || !email || !password) {
      console.log('Registration failed: Missing fields');
      return res.status(400).json({ msg: 'Please provide name, email and password' });
    }
    
    if (password.length < 6) {
      console.log('Registration failed: Password too short');
      return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      console.log('Registration failed: User already exists -', email);
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    // Create new user
    const newUser = {
      id: Date.now(),
      name,
      email,
      password, // In production, this should be hashed
      createdAt: new Date()
    };
    
    users.push(newUser);
    
    // Return success response
    const response = { 
      token: 'mock_token_' + newUser.id, 
      user: { 
        id: newUser.id, 
        name: newUser.name, 
        email: newUser.email 
      } 
    };
    
    res.json(response);
    console.log(`✅ User registered successfully: ${email}`);
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ msg: 'Server error during registration' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    console.log('Login request received for:', req.body.email);
    const { email, password } = req.body;
    
    // Enhanced validation
    if (!email || !password) {
      console.log('Login failed: Missing credentials');
      return res.status(400).json({ msg: 'Please provide email and password' });
    }
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      console.log('Login failed: Invalid credentials for', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // Return success response
    const response = { 
      token: 'mock_token_' + user.id, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      } 
    };
    
    res.json(response);
    console.log(`✅ User logged in successfully: ${email}`);
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ msg: 'Server error during login' });
  }
});

// Basic home route
app.get('/', (req, res) => {
  res.send('Live Table Reservation System API - Mock Version');
});

// Restaurant API route (simplified)
app.get('/api/restaurants/nearby', (req, res) => {
  try {
    const { lat, lng, radius = '2000', keywords = '' } = req.query;
    
    console.log(`Restaurant search: lat=${lat}, lng=${lng}, radius=${radius}, keywords=${keywords}`);
    
    // Return mock restaurant data
    const mockRestaurants = [
      {
        place_id: "1",
        name: "Bella Italia",
        vicinity: "123 Main Street, Downtown",
        rating: 4.5,
        user_ratings_total: 324,
        cuisine: "Italian",
        phone: "+1-555-0123",
        distance: 250,
        source: 'mock'
      },
      {
        place_id: "2", 
        name: "Dragon Palace",
        vicinity: "456 Oak Avenue, City Center",
        rating: 4.3,
        user_ratings_total: 198,
        cuisine: "Chinese",
        phone: "+1-555-0456",
        distance: 420,
        source: 'mock'
      },
      {
        place_id: "3",
        name: "Spice Garden",
        vicinity: "789 Pine Road, Old Town",
        rating: 4.7,
        user_ratings_total: 267,
        cuisine: "Indian",
        phone: "+1-555-0789",
        distance: 650,
        source: 'mock'
      }
    ];

    res.json({ 
      results: mockRestaurants,
      total: mockRestaurants.length,
      source: 'mock'
    });
  } catch (error) {
    console.error('Restaurant search error:', error);
    res.status(500).json({ msg: 'Server error fetching restaurants' });
  }
});

// Reservation endpoint with email confirmation
app.post('/api/reservations', async (req, res) => {
  try {
    const { restaurant, table, booking } = req.body;
    
    // Validate required fields
    if (!restaurant || !booking || !booking.customerEmail || !booking.customerName) {
      return res.status(400).json({ 
        msg: 'Please provide all required reservation details (restaurant, booking info, customer email and name)' 
      });
    }

    // Generate confirmation ID
    const confirmationId = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();

    // Create reservation object
    const reservation = {
      id: Date.now(),
      confirmationId,
      restaurant,
      table,
      booking,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    // Store reservation
    reservations.push(reservation);

    // Send confirmation email
    const emailResult = await sendConfirmationEmail(booking.customerEmail, {
      restaurant,
      table,
      booking,
      confirmationId
    });

    console.log(`✅ New reservation created: ${confirmationId} for ${booking.customerName}`);

    res.json({
      success: true,
      reservation,
      emailSent: emailResult.success,
      message: emailResult.message
    });

  } catch (error) {
    console.error('Reservation creation error:', error);
    res.status(500).json({ 
      msg: 'Server error creating reservation',
      error: error.message 
    });
  }
});

// Get reservations endpoint (optional - for future use)
app.get('/api/reservations', (req, res) => {
  res.json({
    reservations: reservations.map(r => ({
      ...r,
      // Don't expose sensitive customer info in list view
      booking: {
        ...r.booking,
        customerPhone: r.booking.customerPhone?.replace(/(.{3}).*(.{4})/, '$1****$2')
      }
    }))
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/auth/register');
  console.log('  POST /api/auth/login');
  console.log('  GET /api/restaurants/nearby');
  console.log('  POST /api/reservations (with email confirmation)');
  console.log('  GET /api/reservations');
});

process.on('SIGINT', () => {
  console.log('Server shutting down...');
  process.exit(0);
});