// Vercel Serverless Function for Login
module.exports = (req, res) => {
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
    console.log('Login request received for:', req.body.email);
    const { email, password } = req.body;
    
    // Enhanced validation
    if (!email || !password) {
      console.log('Login failed: Missing credentials');
      return res.status(400).json({ msg: 'Please provide email and password' });
    }
    
    if (password.length < 3) {
      console.log('Login failed: Password too short');
      return res.status(400).json({ msg: 'Password must be at least 3 characters long' });
    }
    
    // For demo purposes, we'll accept any valid email/password combination
    const user = {
      id: Date.now(),
      name: email.split('@')[0],
      email
    };
    
    // Return success response
    const response = { 
      token: 'demo_token_' + user.id, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      } 
    };
    
    res.json(response);
    console.log(`✅ Demo user logged in successfully: ${email}`);
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ msg: 'Server error during login' });
  }
};