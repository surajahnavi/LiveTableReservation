import React, { useState, useCallback, useEffect } from "react";
import VoiceBot from "./VoiceBot";

const NearbyRestaurantsPage = ({ location, onBack, cuisines }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("detecting");
  const [, setSelectedVoiceRestaurant] = useState(null); // eslint-disable-line no-unused-vars

  // Detect user's current location
  useEffect(() => {
    if (location) {
      setCurrentLocation(location);
      setLocationStatus("provided");
      return;
    }

    // Try to get user's current location
    setLocationStatus("detecting");
    
    if ("geolocation" in navigator) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const detectedLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          console.log("Location detected:", detectedLocation);
          setCurrentLocation(detectedLocation);
          setLocationStatus("detected");
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback to default location (New York City)
          const fallbackLocation = { latitude: 40.7128, longitude: -74.0060 };
          setCurrentLocation(fallbackLocation);
          setLocationStatus("fallback");
        },
        options
      );
    } else {
      // Geolocation not supported, use fallback
      const fallbackLocation = { latitude: 40.7128, longitude: -74.0060 };
      setCurrentLocation(fallbackLocation);
      setLocationStatus("fallback");
    }
  }, [location]);

  // Handle booking a table
  const handleBookTable = (restaurant) => {
    console.log("Booking table for restaurant:", restaurant);
    // For now, we'll pass the restaurant data to parent component
    // Later this can be enhanced to navigate to a booking page
    if (onBack) {
      onBack({ action: 'book_table', restaurant });
    }
  };

  const fetchRestaurants = useCallback(async () => {
    console.log("fetchRestaurants called");
    console.log("current location:", currentLocation);
    console.log("cuisines:", cuisines);
    
    if (!currentLocation || (!currentLocation.latitude && !currentLocation.longitude)) {
      console.log("No location available");
      setError("Location not available. Please allow location access or try again.");
      return;
    }
    
    setLoading(true);
    setError("");
    setRestaurants([]); // Clear previous results
    
    try {
      // Enhanced mock restaurant data with different cuisines
      const allMockRestaurants = [
        // Italian Restaurants
        {
          place_id: "1",
          name: "Bella Italia",
          vicinity: "123 Main Street, Downtown",
          rating: 4.5,
          user_ratings_total: 324,
          cuisine: "Italian",
          phone: "+1-555-0123",
          distance: 250,
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop",
          price_level: "$$"
        },
        {
          place_id: "2",
          name: "Romano's Pizzeria",
          vicinity: "789 Oak Street, Little Italy",
          rating: 4.3,
          user_ratings_total: 156,
          cuisine: "Italian",
          phone: "+1-555-0789",
          distance: 680,
          image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop",
          price_level: "$"
        },
        
        // Chinese Restaurants
        {
          place_id: "3", 
          name: "Dragon Palace",
          vicinity: "456 Oak Avenue, City Center",
          rating: 4.3,
          user_ratings_total: 198,
          cuisine: "Chinese",
          phone: "+1-555-0456",
          distance: 420,
          image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
          price_level: "$$$"
        },
        {
          place_id: "4",
          name: "Golden Wok",
          vicinity: "321 Bamboo Lane, Chinatown",
          rating: 4.1,
          user_ratings_total: 287,
          cuisine: "Chinese",
          phone: "+1-555-0321",
          distance: 890,
          image: "https://images.unsplash.com/photo-1559847844-d72dfe06ae7a?w=300&h=200&fit=crop",
          price_level: "$$"
        },

        // Indian Restaurants
        {
          place_id: "5",
          name: "Spice Garden",
          vicinity: "789 Pine Road, Old Town",
          rating: 4.7,
          user_ratings_total: 267,
          cuisine: "Indian",
          phone: "+1-555-0789",
          distance: 650,
          image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=200&fit=crop",
          price_level: "$$"
        },
        {
          place_id: "6",
          name: "Mumbai Express",
          vicinity: "654 Curry Street, Spice District",
          rating: 4.4,
          user_ratings_total: 203,
          cuisine: "Indian",
          phone: "+1-555-0654",
          distance: 1120,
          image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop",
          price_level: "$$"
        },
        {
          place_id: "21",
          name: "South Indian Delights",
          vicinity: "456 Dosa Lane, Little India",
          rating: 4.6,
          user_ratings_total: 189,
          cuisine: "South Indian",
          phone: "+1-555-0456",
          distance: 420,
          image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=300&h=200&fit=crop",
          price_level: "$$"
        },
        {
          place_id: "22",
          name: "Chennai Kitchen",
          vicinity: "789 Sambar Street, Tamil Quarter",
          rating: 4.5,
          user_ratings_total: 234,
          cuisine: "South Indian",
          phone: "+1-555-0789",
          distance: 890,
          image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=200&fit=crop",
          price_level: "$"
        },

        // Japanese Restaurants
        {
          place_id: "7",
          name: "Tokyo Sushi Bar",
          vicinity: "321 Cherry Lane, Riverside",
          rating: 4.6,
          user_ratings_total: 412,
          cuisine: "Japanese",
          phone: "+1-555-0321",
          distance: 780,
          image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=300&h=200&fit=crop",
          price_level: "$$$"
        },
        {
          place_id: "8",
          name: "Sakura Ramen House",
          vicinity: "987 Noodle Avenue, Japan Town",
          rating: 4.2,
          user_ratings_total: 345,
          cuisine: "Japanese",
          phone: "+1-555-0987",
          distance: 1240,
          image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop",
          price_level: "$"
        },

        // French Restaurants
        {
          place_id: "9",
          name: "Café Bistro",
          vicinity: "654 Elm Street, Arts District",
          rating: 4.2,
          user_ratings_total: 156,
          cuisine: "French",
          phone: "+1-555-0654",
          distance: 890,
          image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=300&h=200&fit=crop",
          price_level: "$$"
        },
        {
          place_id: "10",
          name: "Le Petit Paris",
          vicinity: "123 Croissant Boulevard, French Quarter",
          rating: 4.8,
          user_ratings_total: 289,
          cuisine: "French",
          phone: "+1-555-0123",
          distance: 1340,
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop",
          price_level: "$$$$"
        },

        // Mexican Restaurants
        {
          place_id: "11",
          name: "Taco Fiesta",
          vicinity: "987 Sunset Boulevard, Beach Area",
          rating: 4.1,
          user_ratings_total: 289,
          cuisine: "Mexican",
          phone: "+1-555-0987",
          distance: 1200,
          image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=200&fit=crop",
          price_level: "$"
        },
        {
          place_id: "12",
          name: "Casa de Burrito",
          vicinity: "456 Salsa Street, Latino District",
          rating: 4.3,
          user_ratings_total: 234,
          cuisine: "Mexican",
          phone: "+1-555-0456",
          distance: 980,
          image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=300&h=200&fit=crop",
          price_level: "$$"
        },

        // Thai Restaurants
        {
          place_id: "13",
          name: "Thai Orchid",
          vicinity: "789 Spice Lane, Asian Quarter",
          rating: 4.5,
          user_ratings_total: 178,
          cuisine: "Thai",
          phone: "+1-555-0789",
          distance: 1450,
          image: "https://images.unsplash.com/photo-1559847844-d72dfe06ae7a?w=300&h=200&fit=crop",
          price_level: "$$"
        },
        {
          place_id: "14",
          name: "Bangkok Street Food",
          vicinity: "321 Pad Thai Avenue, Little Thailand",
          rating: 4.0,
          user_ratings_total: 156,
          cuisine: "Thai",
          phone: "+1-555-0321",
          distance: 1680,
          image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop",
          price_level: "$"
        },

        // American Restaurants
        {
          place_id: "15",
          name: "The Burger Joint",
          vicinity: "123 Main Street, Downtown",
          rating: 4.2,
          user_ratings_total: 567,
          cuisine: "American",
          phone: "+1-555-0123",
          distance: 340,
          image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
          price_level: "$$"
        },
        {
          place_id: "16",
          name: "Steakhouse Grill",
          vicinity: "987 Beef Boulevard, Meat District",
          rating: 4.6,
          user_ratings_total: 423,
          cuisine: "American",
          phone: "+1-555-0987",
          distance: 1890,
          image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop",
          price_level: "$$$"
        },

        // Mediterranean Restaurants
        {
          place_id: "17",
          name: "Olive Garden Mediterranean",
          vicinity: "456 Olive Street, Mediterranean Quarter",
          rating: 4.4,
          user_ratings_total: 298,
          cuisine: "Mediterranean",
          phone: "+1-555-0456",
          distance: 1120,
          image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=200&fit=crop",
          price_level: "$$"
        },
        {
          place_id: "18",
          name: "Santorini Taverna",
          vicinity: "789 Greek Lane, Hellenic District",
          rating: 4.7,
          user_ratings_total: 201,
          cuisine: "Mediterranean",
          phone: "+1-555-0789",
          distance: 1560,
          image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=300&h=200&fit=crop",
          price_level: "$$$"
        },

        // German Restaurants
        {
          place_id: "19",
          name: "Das Bratwurst Haus",
          vicinity: "321 Beer Garden Way, German District",
          rating: 4.1,
          user_ratings_total: 167,
          cuisine: "German",
          phone: "+1-555-0321",
          distance: 1780,
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop",
          price_level: "$$"
        },
        {
          place_id: "20",
          name: "Oktoberfest Restaurant",
          vicinity: "654 Sausage Street, Bavaria District",
          rating: 4.3,
          user_ratings_total: 234,
          cuisine: "German",
          phone: "+1-555-0654",
          distance: 2100,
          image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
          price_level: "$$"
        }
      ];

      // Filter by cuisine if selected
      let filteredRestaurants = allMockRestaurants;
      if (cuisines && cuisines.length > 0) {
        filteredRestaurants = allMockRestaurants.filter(restaurant => 
          cuisines.some(cuisine => {
            const cuisineLower = cuisine.toLowerCase();
            const restaurantCuisine = restaurant.cuisine.toLowerCase();
            const restaurantName = restaurant.name.toLowerCase();
            
            // Handle specific cuisine mappings
            if (cuisineLower.includes('south indian')) {
              return restaurantCuisine.includes('south indian') || restaurantCuisine.includes('indian');
            }
            if (cuisineLower.includes('north indian')) {
              return restaurantCuisine.includes('north indian') || restaurantCuisine.includes('indian');
            }
            if (cuisineLower.includes('indian')) {
              return restaurantCuisine.includes('indian') || restaurantCuisine.includes('south indian');
            }
            if (cuisineLower.includes('chinese')) {
              return restaurantCuisine.includes('chinese');
            }
            if (cuisineLower.includes('italian')) {
              return restaurantCuisine.includes('italian');
            }
            if (cuisineLower.includes('japanese')) {
              return restaurantCuisine.includes('japanese');
            }
            if (cuisineLower.includes('mexican')) {
              return restaurantCuisine.includes('mexican');
            }
            if (cuisineLower.includes('thai')) {
              return restaurantCuisine.includes('thai');
            }
            if (cuisineLower.includes('french')) {
              return restaurantCuisine.includes('french');
            }
            if (cuisineLower.includes('american')) {
              return restaurantCuisine.includes('american');
            }
            if (cuisineLower.includes('mediterranean')) {
              return restaurantCuisine.includes('mediterranean');
            }
            if (cuisineLower.includes('german')) {
              return restaurantCuisine.includes('german');
            }
            
            // Fallback to original matching
            return restaurantCuisine.includes(cuisineLower) || 
                   restaurantName.includes(cuisineLower);
          })
        );
      }

      console.log("Cuisines selected:", cuisines);
      console.log("Total restaurants:", allMockRestaurants.length);
      console.log("Filtered restaurants:", filteredRestaurants.length);
      setRestaurants(filteredRestaurants);
      
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch restaurants. Please check your internet connection and try again.");
    }
    setLoading(false);
  }, [currentLocation, cuisines]);

  // Handle voice restaurant found
  const handleVoiceRestaurantFound = useCallback((restaurant) => {
    console.log('Voice search found restaurant:', restaurant);
    setSelectedVoiceRestaurant(restaurant);
    
    // Scroll to the restaurant if it's in the list
    const restaurantElement = document.getElementById(`restaurant-${restaurant.id}`);
    if (restaurantElement) {
      restaurantElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Highlight the restaurant briefly
      restaurantElement.style.boxShadow = '0 0 0 3px #22c55e';
      setTimeout(() => {
        restaurantElement.style.boxShadow = '';
      }, 3000);
    }
  }, []);

  return (
    <div className="onboarding-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f6fa' }}>
      <div className="onboarding-card" style={{ background: '#fff', borderRadius: 24, boxShadow: '0 4px 32px rgba(80,120,200,0.08)', padding: '48px 32px', maxWidth: 700, width: '100%', margin: '0 auto' }}>
        <h2 style={{ fontWeight: 700, fontSize: 28, color: '#222', marginBottom: 16 }}>
          Nearby {cuisines && cuisines.length > 0 ? cuisines.join(', ') : ''} Restaurants
        </h2>
        
        {/* Location Status */}
        <div style={{ marginBottom: 20, padding: 12, borderRadius: 8, background: getLocationStatusColor() }}>
          <strong>Location: </strong>
          {getLocationStatusText()}
          {currentLocation && (
            <div style={{ fontSize: 14, marginTop: 4, opacity: 0.8 }}>
              📍 {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <button 
            onClick={onBack} 
            style={{ 
              background: '#fff', 
              color: '#1976d2', 
              border: '1px solid #1976d2', 
              borderRadius: 8, 
              padding: '12px 24px', 
              fontWeight: 600, 
              fontSize: 16,
              cursor: 'pointer'
            }}
          >
            Back
          </button>
          <button 
            onClick={fetchRestaurants} 
            disabled={loading || !currentLocation} 
            style={{ 
              background: currentLocation ? '#1976d2' : '#ccc', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 8, 
              padding: '12px 24px', 
              fontWeight: 600, 
              fontSize: 16, 
              opacity: loading ? 0.7 : 1,
              cursor: currentLocation ? 'pointer' : 'not-allowed'
            }}
          >
            {loading ? 'Searching...' : 'Find Restaurants'}
          </button>
        </div>
        
        {loading && (
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ marginBottom: 8 }}>🔍 Searching for restaurants...</div>
            <div style={{ fontSize: 14, color: '#666' }}>
              Checking multiple restaurant databases for the best results
            </div>
          </div>
        )}
        
        {error && (
          <div style={{ 
            color: '#d32f2f', 
            background: '#ffebee', 
            padding: 12, 
            borderRadius: 8, 
            marginBottom: 16,
            border: '1px solid #ffcdd2'
          }}>
            ⚠️ {error}
          </div>
        )}
        
        {!loading && !error && restaurants.length > 0 && (
          <div style={{ marginBottom: 16, padding: 12, background: '#e8f5e8', borderRadius: 8, border: '1px solid #4caf50' }}>
            ✅ Found {restaurants.length} restaurants nearby
          </div>
        )}
        
        {!loading && !error && (
          <div style={{ marginTop: 16 }}>
            {restaurants.map((restaurant) => (
              <div 
                key={restaurant.place_id}
                id={`restaurant-${restaurant.id || restaurant.place_id}`}
                style={{
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                marginBottom: 20,
                overflow: 'hidden',
                border: '1px solid #e6eaf3'
              }}>
                {/* Restaurant Image */}
                <div style={{
                  width: '100%',
                  height: 200,
                  backgroundImage: `url(${restaurant.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  {/* Price Level Badge */}
                  {restaurant.price_level && (
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 'bold'
                    }}>
                      {restaurant.price_level}
                    </div>
                  )}
                  
                  {/* Distance Badge */}
                  <div style={{
                    position: 'absolute',
                    bottom: 12,
                    right: 12,
                    background: 'rgba(25, 118, 210, 0.9)',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 'bold'
                  }}>
                    {restaurant.distance}m away
                  </div>
                </div>

                {/* Restaurant Info */}
                <div style={{ padding: 20 }}>
                  {/* Header */}
                  <div style={{ marginBottom: 12 }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: 22,
                      fontWeight: 700,
                      color: '#222',
                      marginBottom: 4
                    }}>
                      {restaurant.name}
                    </h3>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 8
                    }}>
                      {restaurant.rating && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}>
                          <span style={{ color: '#ff9800', fontSize: 16 }}>★</span>
                          <span style={{ fontWeight: 600, color: '#333' }}>{restaurant.rating}</span>
                          {restaurant.user_ratings_total && (
                            <span style={{ color: '#666', fontSize: 14 }}>
                              ({restaurant.user_ratings_total} reviews)
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div style={{
                      display: 'inline-block',
                      background: '#e3f2fd',
                      color: '#1565c0',
                      padding: '4px 12px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      marginBottom: 12
                    }}>
                      {restaurant.cuisine}
                    </div>
                  </div>

                  {/* Address */}
                  <div style={{
                    color: '#666',
                    fontSize: 14,
                    marginBottom: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}>
                    <span>📍</span>
                    {restaurant.vicinity}
                  </div>

                  {/* Contact Info */}
                  {restaurant.phone && (
                    <div style={{
                      color: '#666',
                      fontSize: 14,
                      marginBottom: 16,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      <span>📞</span>
                      <a href={`tel:${restaurant.phone}`} style={{
                        color: '#1976d2',
                        textDecoration: 'none'
                      }}>
                        {restaurant.phone}
                      </a>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: 12,
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    {/* View on Map */}
                    <button style={{
                      background: 'transparent',
                      border: '2px solid #1976d2',
                      color: '#1976d2',
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                    onClick={() => {
                      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name + ' ' + restaurant.vicinity)}`;
                      window.open(mapsUrl, '_blank');
                    }}>
                      🗺️ View on Map
                    </button>

                    {/* Book a Table Button */}
                    <button style={{
                      background: '#4caf50',
                      border: 'none',
                      color: '#fff',
                      padding: '12px 24px',
                      borderRadius: 8,
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
                    }}
                    onClick={() => handleBookTable(restaurant)}>
                      🍽️ Book a Table
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {restaurants.length === 0 && !loading && !error && (
              <div style={{ 
                textAlign: 'center', 
                color: '#666', 
                fontStyle: 'italic',
                padding: 40,
                background: '#f8f9fa',
                borderRadius: 8,
                border: '2px dashed #ddd'
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <div style={{ fontSize: 18, marginBottom: 8 }}>No restaurants found</div>
                <div>Click "Find Restaurants" to search for nearby restaurants</div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Voice Search Bot */}
      <VoiceBot 
        onRestaurantFound={handleVoiceRestaurantFound}
        restaurants={restaurants}
      />
    </div>
  );

  // Helper function to get location status color
  function getLocationStatusColor() {
    switch (locationStatus) {
      case 'detecting': return '#fff3cd';
      case 'detected': return '#d1edff';
      case 'provided': return '#d4edda';
      case 'fallback': return '#f8d7da';
      default: return '#f8f9fa';
    }
  }

  // Helper function to get location status text
  function getLocationStatusText() {
    switch (locationStatus) {
      case 'detecting': return '🔍 Detecting your location...';
      case 'detected': return '📍 Using your current location';
      case 'provided': return '📍 Using provided location';
      case 'fallback': return '⚠️ Using default location (New York City)';
      default: return 'Location status unknown';
    }
  }
};

export default NearbyRestaurantsPage;
