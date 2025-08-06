// src/utils/constants.js

// Determine API URL based on environment variable first, then fallback to same-origin dev / prod hosts.
const getApiUrl = () => {
  // 1) Use explicit env variable if provided (recommended)
  if (import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // 2) If running in browser, point to same host (works for localhost, 192.x, etc.)
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    // Assume backend on port 3000 if on localhost-ish, else default to same origin
    const isLocal = hostname === 'localhost' || hostname.startsWith('192.') || hostname.startsWith('127.') || hostname.endsWith('.local');
    if (isLocal) {
      return `${protocol}//${hostname}:3000/api`;
    }
    // Production default
    return `${protocol}//${hostname}/api`;
  }

  // 3) Fallback (SSR / tests)
  return 'https://urbanpilgrimfix.onrender.com/api';
};

export const BASE_URL = getApiUrl();

// Debug info
if (typeof window !== 'undefined') {
  console.log('Current environment:', {
    hostname: window.location.hostname,
    apiUrl: BASE_URL,
    isProduction: window.location.hostname !== 'localhost'
  });
}

export const PRICE_RANGES = [
  { value: 'under-25000', label: 'Under ₹25,000' },
  { value: '25000-50000', label: '₹25,000 - ₹50,000' },
  { value: '50000-100000', label: '₹50,000 - ₹100,000' },
  { value: 'above-100000', label: 'Above ₹100,000' }
];

export const ROUTES = {
  HOME: '/',
  EXPERIENCES: '/experiences',
  EXPERIENCE_DETAIL: '/experiences/:id',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',
  ADMIN_DASHBOARD: '/admin/dashboard'
};

export const API_ENDPOINTS = {
  PILGRIM_EXPERIENCES: '/pilgrim-experiences'
};