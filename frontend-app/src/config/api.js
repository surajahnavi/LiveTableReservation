// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://live-table-reservation-3.vercel.app/api'  // Use absolute URL for production
  : 'http://localhost:5000/api';  // In development, use local server

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
  },
  RESERVATIONS: `${API_BASE_URL}/reservations`,
  RESTAURANTS: `${API_BASE_URL}/restaurants`,
  GEO: `${API_BASE_URL}/geo`,
  PLACES: `${API_BASE_URL}/places`,
};

// Fallback function when API is not available
export const handleAPIError = (error) => {
  console.error('API Error:', error);
  if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
    return 'Server is temporarily unavailable. Please try again later.';
  }
  return error.message || 'Something went wrong. Please try again.';
};

export default API_BASE_URL;