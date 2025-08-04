// src/services/pilgrimExperienceApi.js
import axios from 'axios';
import { getTokenFromCookie } from '../utils/cookies';
import { BASE_URL } from '../utils/constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const pilgrimExperienceApi = {
  // Get all pilgrim experiences
  getAll: async () => {
    try {
      console.log('Fetching pilgrim experiences...');
      const response = await api.get('/pilgrim-experiences');
      console.log('Raw API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get pilgrim experience by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/pilgrim-experiences/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new pilgrim experience
  create: async (formData) => {
    try {
      const response = await api.post('/pilgrim-experiences', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update pilgrim experience
  update: async (id, formData) => {
    try {
      const response = await api.put(`/pilgrim-experiences/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete pilgrim experience
  delete: async (id) => {
    try {
      const response = await api.delete(`/pilgrim-experiences/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Generate available dates for an experience
  generateDates: async (id, dateRange) => {
    try {
      const response = await api.post(`/pilgrim-experiences/${id}/generate-dates`, dateRange);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create booking and get payment URL
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings/pilgrim/create', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};