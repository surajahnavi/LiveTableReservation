
import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, apiFetch, handleAPIError } from './config/api';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import PreferencesPage from './PreferencesPage';
import CuisinePage from './CuisinePage';
import DiningStylePage from './DiningStylePage';
import SpiceLevelPage from './SpiceLevelPage';
import AllergyPage from './AllergyPage';
import PartyDetailsPage from './PartyDetailsPage';
import SummaryPage from './SummaryPage';
import NearbyRestaurantsPage from './NearbyRestaurantsPage';
import TableSelectionPage from './TableSelectionPage';
import BookTablePage from './BookTablePage';
import AppVoiceBot from './AppVoiceBot';

function Dashboard({ onSignIn }) {
  // Placeholder for TableBook dashboard UI (see attachment)
  return (
    <div>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 32, color: '#1976d2', marginRight: 8 }}>🏢</span>
          <span style={{ fontWeight: 700, fontSize: 28, color: '#1976d2' }}>TableBook</span>
        </div>
        <div>
            <button style={{ marginRight: 8, border: '1px solid #1976d2', background: '#fff', color: '#1976d2', borderRadius: 6, padding: '8px 18px', fontWeight: 500 }} onClick={onSignIn}>Sign In</button>
            <button style={{ background: '#009be5', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 500 }} onClick={onSignIn}>Get Started</button>
        </div>
      </header>
      <section style={{ textAlign: 'center', margin: '48px 0 32px 0' }}>
        <h1 style={{ fontSize: 48, color: '#009be5', marginBottom: 0 }}>Streamline Your</h1>
        <h1 style={{ fontSize: 48, fontWeight: 700, marginTop: 0 }}>Restaurant Reservations</h1>
        <p style={{ fontSize: 22, color: '#5a6a7a', maxWidth: 700, margin: '24px auto' }}>
          Professional table reservation system for restaurants and customers. Manage bookings, track availability, and provide exceptional dining experiences with our modern platform.
        </p>
        <div style={{ marginTop: 32 }}>
    <button style={{ background: '#009be5', color: '#fff', border: 'none', borderRadius: 6, padding: '14px 32px', fontWeight: 600, fontSize: 20, marginRight: 16 }} onClick={onSignIn}>Start Free Trial</button>
    <button style={{ background: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: 6, padding: '14px 32px', fontWeight: 600, fontSize: 20 }} onClick={onSignIn}>Book a Table</button>
        </div>
      </section>
      <section style={{ margin: '48px 0' }}>
        <h2 style={{ textAlign: 'center', color: '#1976d2', fontSize: 36, fontWeight: 700 }}>Why Choose TableBook?</h2>
        <p style={{ textAlign: 'center', color: '#5a6a7a', fontSize: 20, marginBottom: 40 }}>
          Discover the features that make us the preferred choice for restaurants worldwide
        </p>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 32, minWidth: 320, maxWidth: 350 }}>
            <div style={{ fontSize: 36, color: '#009be5', marginBottom: 12 }}>🕒</div>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Real-time Availability</div>
            <div style={{ color: '#5a6a7a', fontSize: 16 }}>
              Check table availability instantly and prevent double bookings with our advanced real-time system that updates across all platforms.
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 32, minWidth: 320, maxWidth: 350 }}>
            <div style={{ fontSize: 36, color: '#009be5', marginBottom: 12 }}>📊</div>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Analytics Dashboard</div>
            <div style={{ color: '#5a6a7a', fontSize: 16 }}>
              Track booking trends, customer preferences, and restaurant performance with detailed analytics and actionable insights.
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 32, minWidth: 320, maxWidth: 350 }}>
            <div style={{ fontSize: 36, color: '#009be5', marginBottom: 12 }}>📱</div>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Mobile Friendly</div>
            <div style={{ color: '#5a6a7a', fontSize: 16 }}>
              Fully responsive design that works perfectly on all devices, ensuring seamless experience for customers and staff.
            </div>
          </div>
        </div>
      </section>
      <footer style={{ textAlign: 'center', marginTop: 48, padding: 24 }}>
        <div style={{ fontSize: 24, color: '#1976d2', fontWeight: 700, marginBottom: 8 }}>🏢 TableBook</div>
        <div style={{ color: '#5a6a7a', fontSize: 16 }}>
          © 2024 TableBook. Professional Restaurant Reservation System.
        </div>
      </footer>
    </div>
  );
}


function App() {
  const [page, setPage] = useState('dashboard');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [loginError, setLoginError] = useState('');
  const [user, setUser] = useState(null);
  const [partyDetails, setPartyDetails] = useState({ people: 2, diningTime: '' });
  // Add state for summary preferences (replace with real state as needed)
  const [cuisines, setCuisines] = useState([]);
  const [diningStyle, setDiningStyle] = useState('fine-dining');
  const [spiceLevel, setSpiceLevel] = useState('Medium');
  const [allergies, setAllergies] = useState([]);
  const [location, setLocation] = useState(null);
  
  // Booking state
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [, setBookingConfirmation] = useState(null); // eslint-disable-line no-unused-vars

  // Load demo user data on app startup if available
  useEffect(() => {
    const demoUser = localStorage.getItem('demo-user');
    if (demoUser) {
      try {
        const userData = JSON.parse(demoUser);
        setUser(userData);
        console.log('Loaded demo user:', userData.email);
      } catch (e) {
        console.error('Error loading demo user:', e);
        localStorage.removeItem('demo-user');
      }
    }
  }, []);

  // Voice navigation handler
  const handleVoiceNavigation = (targetPage) => {
    console.log('🎤 Voice navigation to:', targetPage);
    setPage(targetPage);
  };

  async function handleRegister(form) {
    setRegisterError('');
    setRegisterSuccess('');
    console.log('🔄 Attempting registration for:', form.email);
    
    try {
      const data = await apiFetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password })
      });
      
      console.log('Registration response:', data);
      
      if (data.msg) {
        setRegisterError(data.msg);
        console.log('❌ Registration failed:', data.msg);
      } else {
        console.log('✅ Registration successful:', data.user.email);
        setRegisterSuccess('Registration successful! You can now log in.');
        setTimeout(() => {
          setPage('login');
          setRegisterError('');
          setRegisterSuccess('');
        }, 1500);
      }
    } catch (e) {
      console.error('Registration network error:', e);
      
      // Demo fallback for registration when API is not available
      if (e.message.includes('405') || e.message.includes('404') || e.message.includes('demo mode')) {
        console.log('Using demo registration fallback');
        setRegisterSuccess('✅ Demo account created successfully! You can now login with any email/password.');
        setTimeout(() => {
          setPage('login');
          setRegisterError('');
          setRegisterSuccess('');
        }, 2000);
      } else {
        setRegisterError(handleAPIError(e));
      }
    }
  }

  // Handle login: validate against backend and only proceed if credentials are correct
  async function handleLogin(form) {
    setLoginError('');
    console.log('🔄 Attempting login for:', form.email);
    
    try {
      const data = await apiFetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      
      console.log('Login response:', data);
      
      if (data.msg) {
        setLoginError(data.msg);
        console.log('❌ Login failed:', data.msg);
        return;
      } else {
        // Login successful
        console.log('✅ Login successful:', data.user.email);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        setPage('preferences');
        setLoginError('');
      }
    } catch (e) {
      console.error('Login network error:', e);
      
      // Demo fallback for login when API is not available
      if (e.message.includes('405') || e.message.includes('404') || e.message.includes('demo mode')) {
        console.log('Using demo login fallback');
        // Create a demo user
        const demoUser = {
          name: form.email.split('@')[0], // Use email prefix as name
          email: form.email,
          id: 'demo-' + Date.now()
        };
        setUser(demoUser);
        localStorage.setItem('demo-user', JSON.stringify(demoUser));
        setPage('preferences');
        setLoginError('');
        console.log('✅ Demo login successful for:', form.email);
      } else {
        setLoginError(handleAPIError(e));
      }
    }
  }

  function handleNextFromPreferences() {
    setPage('cuisine');
  }
  
  function handlePrevFromCuisine() {
    setPage('preferences');
  }
  
  function handleNextFromCuisine() {
    setPage('dining');
  }
  
  function handlePrevFromDining() {
    setPage('cuisine');
  }
  
  function handleNextFromDining() {
    setPage('spice');
  }
  function handlePrevFromSpice() {
    setPage('dining');
  }
  function handleNextFromSpice() {
    setPage('allergy');
  }
  function handlePrevFromAllergy() {
    setPage('spice');
  }

  function handleNextFromAllergy() {
    setPage('party');
  }
  function handlePrevFromParty() {
    setPage('allergy');
  }
  function handleNextFromParty() {
    setPage('summary');
  }
  function handleFindRestaurant() {
    console.log('🔄 handleFindRestaurant called - starting navigation to nearby restaurants');
    
    // Navigate immediately to nearby restaurants page
    // Set default location first (NYC coordinates)
    if (!location) {
      console.log('📍 Setting default location (NYC)');
      setLocation({ latitude: 40.7128, longitude: -74.0060 });
    }
    
    // Navigate immediately - don't wait for geolocation
    console.log('🏃‍♂️ Navigating to nearby restaurants page...');
    setPage('nearby');
    
    // Try to get real location in background (optional enhancement)
    if (navigator.geolocation && !location) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // Update location with real coordinates if available
          console.log('📍 Real location obtained:', pos.coords.latitude, pos.coords.longitude);
          setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        },
        (error) => {
          // Location request failed, but that's okay - we already have default location
          console.log('Geolocation failed, using default location:', error);
        },
        { timeout: 5000 } // 5 second timeout
      );
    }
  }
  function handleBackFromNearby(action) {
    if (action && action.action === 'book_table') {
      setSelectedRestaurant(action.restaurant);
      setSelectedTable(null); // Reset table selection
      setPage('table-selection');
    } else {
      setPage('summary');
    }
  }

  function handleBackFromTableSelection() {
    setSelectedTable(null);
    setPage('nearby');
  }

  function handleTableSelect(table) {
    setSelectedTable(table);
    setPage('book-table');
  }

  function handleBackFromBooking() {
    setSelectedRestaurant(null);
    setSelectedTable(null);
    setPage('table-selection');
  }

  function handleConfirmBooking(bookingData) {
    setBookingConfirmation(bookingData);
    // Could also navigate back to nearby or summary page after a delay
  }

  return (
    <div className="App">
      <main style={{ padding: 24 }}>
        {page === 'register' && (
          <RegisterForm
            onRegister={handleRegister}
            error={registerError}
            success={registerSuccess}
          />
        )}
        {page === 'login' && <LoginForm onLogin={handleLogin} onShowRegister={() => setPage('register')} error={loginError} />}
        {page === 'preferences' && <PreferencesPage onNext={handleNextFromPreferences} onUsePreferences={handleFindRestaurant} />}
  {page === 'cuisine' && <CuisinePage onPrev={handlePrevFromCuisine} onNext={handleNextFromCuisine} selectedCuisines={cuisines} setSelectedCuisines={setCuisines} />}
        {page === 'dining' && <DiningStylePage onPrev={handlePrevFromDining} onNext={handleNextFromDining} setDiningStyle={setDiningStyle} />}
        {page === 'spice' && <SpiceLevelPage onPrev={handlePrevFromSpice} onNext={handleNextFromSpice} setSpiceLevel={setSpiceLevel} />}
        {page === 'allergy' && <AllergyPage onPrev={handlePrevFromAllergy} onNext={handleNextFromAllergy} setAllergies={setAllergies} />}
        {page === 'party' && (
          <PartyDetailsPage
            onPrevious={handlePrevFromParty}
            onNext={handleNextFromParty}
            partyDetails={partyDetails}
            setPartyDetails={setPartyDetails}
          />
        )}
        {page === 'summary' && (
          <SummaryPage
            cuisines={cuisines}
            diningStyle={diningStyle}
            spiceLevel={spiceLevel}
            allergies={allergies}
            partyDetails={partyDetails}
            onFindRestaurant={handleFindRestaurant}
          />
        )}
        {page === 'nearby' && (
          <NearbyRestaurantsPage location={location} onBack={handleBackFromNearby} cuisines={cuisines} />
        )}
        {page === 'table-selection' && selectedRestaurant && (
          <TableSelectionPage 
            restaurant={selectedRestaurant}
            partySize={partyDetails.people}
            onBack={handleBackFromTableSelection}
            onTableSelect={handleTableSelect}
          />
        )}
        {page === 'book-table' && selectedRestaurant && selectedTable && (
          <BookTablePage 
            restaurant={selectedRestaurant}
            table={selectedTable}
            onBack={handleBackFromBooking}
            onConfirmBooking={handleConfirmBooking}
          />
        )}
        {page === 'dashboard' && <Dashboard onGetStarted={() => setPage('login')} onSignIn={() => setPage('login')} />}
      </main>
      
      {/* Global Voice Assistant */}
      <AppVoiceBot
        onNavigate={handleVoiceNavigation}
        currentPage={page}
        currentUser={user}
        restaurants={[]} // Could be populated with global restaurant data
      />
    </div>
  );
}

export default App;
