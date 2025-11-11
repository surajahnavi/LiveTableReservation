const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');

// Load environment variables
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

// Data extraction script for Geoapify API
class GeoapifyExtractor {
  constructor() {
    this.apiKey = process.env.GEOAPIFY_API_KEY;
    if (!this.apiKey) {
      throw new Error('GEOAPIFY_API_KEY not found in environment variables');
    }
  }

  // Connect to MongoDB
  async connectDB() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected for data extraction');
    } catch (error) {
      console.error('MongoDB connection failed:', error);
      throw error;
    }
  }

  // Extract restaurant data from Geoapify feature object
  extractRestaurantData(feature) {
    const props = feature.properties;
    const geom = feature.geometry;

    // Parse facilities from raw data
    const facilities = props.facilities || {};
    const paymentOptions = props.payment_options || {};
    const brandDetails = props.brand_details || {};
    const commercial = props.commercial || {};

    return {
      place_id: props.place_id,
      name: props.name,
      country: props.country,
      country_code: props.country_code,
      state: props.state,
      county: props.county,
      city: props.city,
      postcode: props.postcode,
      suburb: props.suburb,
      street: props.street,
      housenumber: props.housenumber,
      formatted: props.formatted,
      address_line1: props.address_line1,
      address_line2: props.address_line2,
      
      categories: props.categories || [],
      
      website: props.website,
      opening_hours: props.opening_hours,
      phone: props.contact?.phone,
      
      brand: props.brand,
      brand_wikidata: brandDetails.wikidata,
      brand_wikipedia: brandDetails.wikipedia,
      
      wheelchair_accessible: facilities.wheelchair,
      air_conditioning: facilities.air_conditioning,
      internet_access: facilities.internet_access,
      
      payment_cash: paymentOptions.cash,
      payment_cards: paymentOptions.visa || paymentOptions.mastercard || paymentOptions.credit_cards,
      payment_contactless: paymentOptions.contactless,
      
      commercial_type: commercial.type,
      organic: commercial.organic,
      
      location: {
        type: 'Point',
        coordinates: geom.coordinates // [longitude, latitude]
      },
      
      raw_data: props,
      updated_at: new Date()
    };
  }

  // Fetch data from a specific Geoapify API URL
  async fetchFromUrl(url) {
    try {
      console.log(`Fetching data from: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.features || !Array.isArray(data.features)) {
        console.log('No features found in response');
        return [];
      }

      return data.features;
    } catch (error) {
      console.error('Failed to fetch from URL:', error);
      throw error;
    }
  }

  // Save restaurants to MongoDB with upsert (update if exists, insert if new)
  async saveRestaurants(features) {
    const restaurants = features.map(feature => this.extractRestaurantData(feature));
    
    let inserted = 0;
    let updated = 0;
    let errors = 0;

    for (const restaurantData of restaurants) {
      try {
        const result = await Restaurant.findOneAndUpdate(
          { place_id: restaurantData.place_id },
          restaurantData,
          { upsert: true, new: true, runValidators: true }
        );
        
        if (result.created_at.getTime() === result.updated_at.getTime()) {
          inserted++;
        } else {
          updated++;
        }
      } catch (error) {
        console.error(`Failed to save restaurant ${restaurantData.name}:`, error);
        errors++;
      }
    }

    console.log(`Results: ${inserted} inserted, ${updated} updated, ${errors} errors`);
    return { inserted, updated, errors };
  }

  // Extract data from multiple regions/URLs
  async extractFromUrls(urls) {
    await this.connectDB();
    
    let totalInserted = 0;
    let totalUpdated = 0;
    let totalErrors = 0;

    for (const url of urls) {
      try {
        const features = await this.fetchFromUrl(url);
        const results = await this.saveRestaurants(features);
        
        totalInserted += results.inserted;
        totalUpdated += results.updated;
        totalErrors += results.errors;
        
        // Wait a bit between requests to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to process URL ${url}:`, error);
        totalErrors++;
      }
    }

    console.log(`\nFinal totals: ${totalInserted} inserted, ${totalUpdated} updated, ${totalErrors} errors`);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    return { totalInserted, totalUpdated, totalErrors };
  }

  // Build URL for different regions around a center point
  buildUrls(centerLat, centerLng, radiusKm = 10, categories = 'catering.restaurant,commercial.supermarket') {
    const urls = [];
    
    // Create a grid of search areas to cover a larger region
    const step = radiusKm * 0.009; // Rough conversion to degrees (1km ≈ 0.009°)
    
    for (let latOffset = -step; latOffset <= step; latOffset += step) {
      for (let lngOffset = -step; lngOffset <= step; lngOffset += step) {
        const lat = centerLat + latOffset;
        const lng = centerLng + lngOffset;
        const radius = radiusKm * 1000; // Convert to meters
        
        const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lng},${lat},${radius}&limit=50&apiKey=${this.apiKey}`;
        urls.push(url);
      }
    }
    
    return urls;
  }
}

// CLI usage
if (require.main === module) {
  const extractor = new GeoapifyExtractor();
  
  // Get command line arguments
  const args = process.argv.slice(2);
  
  if (args.length > 0 && args[0] === '--url') {
    // Extract from a specific URL
    const url = args[1];
    if (!url) {
      console.error('Please provide a URL after --url');
      process.exit(1);
    }
    
    extractor.extractFromUrls([url])
      .then(() => process.exit(0))
      .catch(error => {
        console.error('Extraction failed:', error);
        process.exit(1);
      });
  } else {
    // Default: extract from region around Donauwörth (from the example URL)
    const centerLat = 48.7;
    const centerLng = 10.78;
    const urls = extractor.buildUrls(centerLat, centerLng, 5); // 5km radius
    
    console.log(`Generated ${urls.length} URLs to extract from`);
    
    extractor.extractFromUrls(urls)
      .then(() => process.exit(0))
      .catch(error => {
        console.error('Extraction failed:', error);
        process.exit(1);
      });
  }
}

module.exports = GeoapifyExtractor;