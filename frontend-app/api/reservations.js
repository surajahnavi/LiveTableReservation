export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

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

    console.log(`✅ New demo reservation created: ${confirmationId} for ${booking.customerName}`);

    res.json({
      success: true,
      reservation,
      emailSent: false,
      message: 'Demo reservation confirmed - Email functionality not available in demo mode'
    });

  } catch (error) {
    console.error('Reservation creation error:', error);
    res.status(500).json({ 
      msg: 'Server error creating reservation',
      error: error.message 
    });
  }
}