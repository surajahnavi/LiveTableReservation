// Vercel Serverless Function for Registration
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
    console.log('Registration request received:', req.body);
    const { name, email, password } = req.body;
    
    // Enhanced validation
    if (!name || !email || !password) {
      console.log('Registration failed: Missing fields');
      return res.status(400).json({ msg: 'Please provide name, email and password' });
    }
    
    if (password.length < 3) {
      console.log('Registration failed: Password too short');
      return res.status(400).json({ msg: 'Password must be at least 3 characters long' });
    }
    
    // For demo purposes, we'll always create a successful registration
    const newUser = {
      id: Date.now(),
      name,
      email,
      createdAt: new Date()
    };
    
    // Return success response
    const response = { 
      token: 'demo_token_' + newUser.id, 
      user: { 
        id: newUser.id, 
        name: newUser.name, 
        email: newUser.email 
      } 
    };
    
    res.json(response);
    console.log(`✅ Demo user registered successfully: ${email}`);
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ msg: 'Server error during registration' });
  }
};