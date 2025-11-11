// Vercel Serverless Function for Restaurant Search
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

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
        source: 'demo'
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
        source: 'demo'
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
        source: 'demo'
      },
      {
        place_id: "4",
        name: "Ocean Breeze Seafood",
        vicinity: "321 Harbor Drive, Waterfront",
        rating: 4.6,
        user_ratings_total: 189,
        cuisine: "Seafood",
        phone: "+1-555-0321",
        distance: 850,
        source: 'demo'
      }
    ];

    res.json({ 
      results: mockRestaurants,
      total: mockRestaurants.length,
      source: 'demo'
    });
  } catch (error) {
    console.error('Restaurant search error:', error);
    res.status(500).json({ msg: 'Server error fetching restaurants' });
  }
}