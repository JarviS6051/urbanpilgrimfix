// src/api/auth.js
import { BASE_URL } from '../utils/constants';
export async function signupUser(data) {
  const res = await fetch(`${BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function signupTrainer(formData) {
  // formData is a FormData object (for file upload)
  const res = await fetch(`${BASE_URL}/users/register-trainer`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

export async function loginUser(data) {
  try {
    console.log('Attempting login with:', { email: data.email, password: '***' });
    console.log('API URL:', `${BASE_URL}/users/login`);
    
    const res = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    console.log('Response status:', res.status);
    console.log('Response headers:', res.headers);
    
    const responseData = await res.json();
    console.log('Response data:', responseData);
    
    if (!res.ok) {
      throw new Error(responseData.message || `HTTP ${res.status}: ${res.statusText}`);
    }
    
    return responseData;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
}

export async function googleAuth(credential) {
  const res = await fetch(`${BASE_URL}/users/google-auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
  return res.json();
}