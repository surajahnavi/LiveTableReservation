import React, { useState } from 'react';

export default function PreferencesPage({ onNext, onUsePreferences }) {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function reverseGeocode(lat, lng) {
    try {
      setLoading(true);
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      setAddress(data.display_name || 'Address not found');
    } catch (e) {
      setAddress('Unable to get address');
    } finally {
      setLoading(false);
    }
  }

  function handleDetectLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setError('');
        reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        if (onNext) setTimeout(onNext, 800);
      },
      (err) => {
        setError('Unable to retrieve your location.');
        setLoading(false);
      }
    );
  }

  // ✅ Function to navigate to NearbyRestaurants page
  function handleUsePreferences() {
    console.log('🎯 PreferencesPage: Use preferences clicked - navigating directly to nearby restaurants');
    onUsePreferences();
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#f9fbfd', borderRadius: 24, boxShadow: '0 2px 24px rgba(0,0,0,0.08)', padding: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
        <span style={{ fontSize: 32, color: '#1976d2', marginRight: 12 }}>👨‍🍳</span>
        <h2 style={{ margin: 0, color: '#222', fontWeight: 700 }}>Welcome to TableBook!</h2>
      </div>
      <div style={{ marginBottom: 16, color: '#1976d2', fontWeight: 600 }}>Step 1 of 7</div>
      <div style={{ height: 6, background: '#e3eaf3', borderRadius: 3, marginBottom: 24 }}>
        <div style={{ width: '14%', height: '100%', background: '#1976d2', borderRadius: 3 }} />
      </div>
      <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Do you have any previous dining preferences saved with us?</div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <button
          style={{ flex: 1, background: '#fff', border: '1px solid #1976d2', color: '#1976d2', borderRadius: 10, padding: 18, fontWeight: 600 }}
          onClick={handleUsePreferences} // ✅ navigate on click
        >
          Yes, use my preferences
        </button>

        <button
          style={{ flex: 1, background: '#009be5', color: '#fff', border: 'none', borderRadius: 10, padding: 18, fontWeight: 600 }}
          onClick={handleDetectLocation}
          disabled={loading}
        >
          No, I'm new here
        </button>
      </div>
      <div style={{ background: '#eaf6ff', borderRadius: 10, padding: 16, color: '#1976d2', fontWeight: 500, marginBottom: 16 }}>
        <span role="img" aria-label="location">📍</span> Why do we need your location?<br />
        <span style={{ color: '#5a6a7a', fontWeight: 400 }}>
          We'll use your location to find the best restaurants near you and show accurate distances and travel times.
        </span>
      </div>
      {location && (
        <div style={{ color: 'green', marginTop: 12 }}>
          <div>Location detected: Latitude {location.lat}, Longitude {location.lng}</div>
          {loading ? <div>Detecting address...</div> : address && <div>Address: {address}</div>}
        </div>
      )}
      {error && (
        <div style={{ color: 'red', marginTop: 12 }}>{error}</div>
      )}
    </div>
  );
}
