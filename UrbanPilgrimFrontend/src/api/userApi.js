// src/api/userApi.js
import { BASE_URL } from '../utils/constants';

// Helper function to get auth headers
const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

// Get user profile
export async function getUserProfile(token) {
  try {
    const response = await fetch(`${BASE_URL}/users/profile`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch profile');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

// Update user profile
export async function updateUserProfile(token, userData) {
  try {
    const response = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// Update user password
export async function updateUserPassword(token, passwordData) {
  try {
    const response = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(passwordData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update password');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
}

// Get user bookings
export async function getUserBookings(token, page = 1, limit = 10, status = null, bookingType = null) {
  try {
    const params = new URLSearchParams({ page, limit });
    if (status) params.append('status', status);
    if (bookingType) params.append('bookingType', bookingType);
    
    const response = await fetch(`${BASE_URL}/users/my-bookings?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch bookings');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
}

// Get booking details
export async function getBookingDetails(token, bookingId) {
  try {
    console.log('Fetching booking details for:', bookingId);
    console.log('API URL:', `${BASE_URL}/users/booking/${bookingId}`);
    console.log('Token:', token ? 'Present' : 'Missing');
    
    const headers = getAuthHeaders(token);
    console.log('Request headers:', headers);
    
    console.log('Making fetch request...');
    const response = await fetch(`${BASE_URL}/users/booking/${bookingId}`, {
      method: 'GET',
      headers: headers,
    });
    
    console.log('Response received');
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    console.log('Response status text:', response.statusText);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.log('Response not ok, trying to read error data...');
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    console.log('Response ok, trying to read JSON...');
    const responseData = await response.json();
    console.log('Booking details response data:', responseData);
    
    return responseData;
  } catch (error) {
    console.error('Error fetching booking details:', error);
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    throw error;
  }
}