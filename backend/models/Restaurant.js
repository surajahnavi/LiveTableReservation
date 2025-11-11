const mongoose = require('mongoose');

// Schema for storing restaurant/place data from Geoapify API
const restaurantSchema = new mongoose.Schema({
  // From properties object
  place_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  country: String,
  country_code: String,
  state: String,
  county: String,
  city: String,
  postcode: String,
  suburb: String,
  street: String,
  housenumber: String,
  formatted: String,
  address_line1: String,
  address_line2: String,
  
  // Categories (array of strings)
  categories: [String],
  
  // Contact and operational info
  website: String,
  opening_hours: String,
  phone: String,
  
  // Brand information
  brand: String,
  brand_wikidata: String,
  brand_wikipedia: String,
  
  // Facilities
  wheelchair_accessible: Boolean,
  air_conditioning: Boolean,
  internet_access: Boolean,
  
  // Payment options
  payment_cash: Boolean,
  payment_cards: Boolean,
  payment_contactless: Boolean,
  
  // Commercial info
  commercial_type: String,
  organic: Boolean,
  
  // Geospatial data - GeoJSON Point for MongoDB geospatial queries
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      index: '2dsphere' // Enable geospatial indexing
    }
  },
  
  // Store raw API response for any additional data
  raw_data: mongoose.Schema.Types.Mixed,
  
  // Metadata
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  data_source: { type: String, default: 'geoapify' }
});

// Create geospatial index for location-based queries
restaurantSchema.index({ location: '2dsphere' });

// Create compound index for common queries
restaurantSchema.index({ categories: 1, city: 1 });
restaurantSchema.index({ commercial_type: 1, location: '2dsphere' });

module.exports = mongoose.model('Restaurant', restaurantSchema);