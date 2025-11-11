const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

// Simple restaurant search using Geoapify API
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = '2000', keywords = '' } = req.query;
    
    console.log(`[Restaurant API] Request: lat=${lat}, lng=${lng}, radius=${radius}, keywords=${keywords}`);
    
    if (!lat || !lng) {
      return res.status(400).json({ msg: 'lat and lng are required' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusMeters = parseInt(radius);

    if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusMeters)) {
      return res.status(400).json({ msg: 'Invalid lat, lng, or radius values' });
    }

    // Use Geoapify API for restaurant search
    const categories = 'catering.restaurant,catering.fast_food,catering.cafe,catering.bar,catering.pub';
    const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${longitude},${latitude},${radiusMeters}&limit=50&apiKey=${process.env.GEOAPIFY_API_KEY}`;
    
    console.log(`[Restaurant API] Fetching from Geoapify: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`[Restaurant API] Geoapify API error: ${response.status}`);
      throw new Error(`Geoapify API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[Restaurant API] Geoapify returned ${data.features ? data.features.length : 0} places`);
    
    // Transform Geoapify response to standard format
    const restaurants = (data.features || []).map(feature => {
      const props = feature.properties;
      const coords = feature.geometry.coordinates;
      
      // Calculate distance
      const distance = calculateDistance(latitude, longitude, coords[1], coords[0]);
      
      return {
        place_id: props.place_id || `geoapify_${feature.id || Math.random()}`,
        name: props.name || 'Unnamed Restaurant',
        vicinity: formatAddress(props),
        rating: props.rating || null,
        user_ratings_total: props.rating_count || null,
        location: {
          lat: coords[1],
          lng: coords[0]
        },
        cuisine: props.cuisine || getCuisineFromCategories(props.categories),
        phone: props.contact?.phone || '',
        website: props.contact?.website || '',
        opening_hours: props.opening_hours || '',
        distance: Math.round(distance),
        source: 'geoapify',
        categories: props.categories || [],
        raw: props
      };
    });

    // Filter by cuisine keywords if provided
    let filteredRestaurants = restaurants;
    if (keywords) {
      const keywordArray = keywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
      filteredRestaurants = restaurants.filter(restaurant => {
        const name = (restaurant.name || '').toLowerCase();
        const cuisine = (restaurant.cuisine || '').toLowerCase();
        const categories = (restaurant.categories || []).join(' ').toLowerCase();
        
        return keywordArray.some(keyword => 
          name.includes(keyword) || 
          cuisine.includes(keyword) || 
          categories.includes(keyword)
        );
      });
      console.log(`[Restaurant API] After keyword filtering: ${filteredRestaurants.length} restaurants`);
    }

    // Sort by distance
    filteredRestaurants.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    console.log(`[Restaurant API] Returning ${filteredRestaurants.length} restaurants`);

    res.json({ 
      results: filteredRestaurants,
      total: filteredRestaurants.length,
      source: 'geoapify',
      location: { lat: latitude, lng: longitude },
      radius: radiusMeters
    });

  } catch (error) {
    console.error('[Restaurant API] Error:', error);
    res.status(500).json({ 
      msg: 'Server error fetching restaurants',
      error: error.message 
    });
  }
});

// Helper function to format address from Geoapify properties
function formatAddress(props) {
  const parts = [];
  
  if (props.housenumber) parts.push(props.housenumber);
  if (props.street) parts.push(props.street);
  if (props.suburb) parts.push(props.suburb);
  if (props.city) parts.push(props.city);
  if (props.postcode) parts.push(props.postcode);
  
  if (parts.length === 0) {
    // Fallback to formatted address or address components
    return props.formatted || 
           props.address_line2 || 
           props.address_line1 || 
           'Address not available';
  }
  
  return parts.join(', ');
}

// Helper function to extract cuisine from categories
function getCuisineFromCategories(categories) {
  if (!categories || !Array.isArray(categories)) return '';
  
  const cuisineMap = {
    'catering.restaurant': 'Restaurant',
    'catering.fast_food': 'Fast Food',
    'catering.cafe': 'Cafe',
    'catering.bar': 'Bar',
    'catering.pub': 'Pub',
    'catering.pizza': 'Pizza',
    'catering.ice_cream': 'Ice Cream',
    'catering.food_court': 'Food Court'
  };
  
  const cuisines = categories.map(cat => cuisineMap[cat] || cat).filter(Boolean);
  return cuisines.join(', ');
}

// Helper function to calculate distance between two points
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Return distance in meters
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

module.exports = router;