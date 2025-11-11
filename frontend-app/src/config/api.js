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

// Safe JSON parsing function
export const safeJsonParse = async (response) => {
  const text = await response.text();
  
  if (!text || text.trim() === '') {
    throw new Error('Empty response from server');
  }
  
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error('JSON Parse Error:', err);
    console.error('Response text:', text);
    throw new Error('Invalid response format from server');
  }
};

// Enhanced fetch function with better error handling
export const apiFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    // Check if response is ok
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Service not found. Please try again later.');
      }
      if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      throw new Error(`Request failed: ${response.status}`);
    }

    // Safely parse JSON
    return await safeJsonParse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }
    throw error;
  }
};

// Fallback function when API is not available
export const handleAPIError = (error) => {
  console.error('API Error:', error);
  if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
    return 'Server is temporarily unavailable. Please try again later.';
  }
  if (error.message.includes('JSON')) {
    return 'Server response error. Please try again later.';
  }
  return error.message || 'Something went wrong. Please try again.';
};

export default API_BASE_URL;