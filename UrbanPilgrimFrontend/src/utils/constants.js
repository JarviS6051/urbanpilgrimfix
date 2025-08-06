// src/utils/constants.js

// Simple API URL configuration for localhost development
const getApiUrl = () => {
  // Use localhost for development
  // return 'http://localhost:3000/api';
  
  // Production API (commented out for now)
  return 'https://urbanpilgrimfix.onrender.com/api';
};

export const BASE_URL = getApiUrl();

// Debug info
if (typeof window !== 'undefined') {
  console.log('API URL:', BASE_URL);
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