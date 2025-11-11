const express = require('express');
const Restaurant = require('../models/Restaurant');

// MongoDB-backed restaurant search (replaces direct Geoapify API calls)
// Data should be pre-populated using the extractRestaurants.js script

const router = express.Router();

router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = '2000', keywords = '' } = req.query;
    console.log(`[API] GET /api/geo/nearby - lat: ${lat}, lng: ${lng}, radius: ${radius}, keywords: ${keywords}`);
    
    if (!lat || !lng) {
      return res.status(400).json({ msg: 'lat and lng required' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusMeters = parseInt(radius);

    if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusMeters)) {
      return res.status(400).json({ msg: 'Invalid lat, lng, or radius values' });
    }

    console.log(`[API] Parsed coords: ${latitude}, ${longitude}, radius: ${radiusMeters}m`);

    // Build MongoDB geospatial query - using simpler approach
    let query = {
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radiusMeters / 6378100] // Earth radius in meters
        }
      }
    };

    // Add category filter for restaurants/food places
    query.categories = { 
      $in: ['catering.restaurant', 'commercial.supermarket', 'commercial.food'] 
    };

    // Optional keyword filtering
    const kwArr = keywords ? keywords.split(',').map(k => k.trim()).filter(Boolean) : [];
    if (kwArr.length > 0) {
      query.$or = kwArr.map(kw => ({
        name: { $regex: kw, $options: 'i' }
      }));
      console.log(`[API] Applying keyword filter: ${kwArr.join(', ')}`);
    }

    console.log(`[API] MongoDB query:`, JSON.stringify(query, null, 2));

    // Execute query with limit
    const restaurants = await Restaurant.find(query)
      .limit(50)
      .sort({ name: 1 })
      .lean(); // Use lean() for better performance

    console.log(`[API] Found ${restaurants.length} restaurants in database`);

    // Map to frontend-compatible format
    const results = restaurants.map(r => ({
      place_id: r.place_id,
      name: r.name,
      vicinity: r.address_line2 || r.address_line1 || r.formatted,
      rating: undefined, // Geoapify doesn't provide ratings
      user_ratings_total: undefined,
      location: r.location,
      raw: {
        ...r.raw_data,
        lon: r.location.coordinates[0],
        lat: r.location.coordinates[1],
        address_line1: r.address_line1,
        address_line2: r.address_line2,
        formatted: r.formatted
      },
    }));

    console.log(`[API] Returning ${results.length} restaurants to frontend`);
    res.json({ results });
  } catch (err) {
    console.error('[API] MongoDB restaurant query error', err);
    res.status(500).json({ msg: 'Server error fetching restaurants from database' });
  }
});

module.exports = router;
