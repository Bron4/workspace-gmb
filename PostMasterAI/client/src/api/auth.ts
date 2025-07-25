import api from './api';

// Description: Login user functionality
// Endpoint: POST /api/auth/login
// Request: { email: string, password: string }
// Response: { accessToken: string, refreshToken: string }
export const login = async (email: string, password: string) => {
  console.log("auth.ts: login function called with email:", email);
  try {
    console.log("auth.ts: Making API request to /api/auth/login");
    const response = await api.post('/api/auth/login', { email, password });
    console.log("auth.ts: Login API response received:", response.data);
    return response.data;
  } catch (error) {
    console.error('auth.ts: Login error:', error);
    console.error('auth.ts: Login error response:', error?.response?.data);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Register user functionality
// Endpoint: POST /api/auth/register
// Request: { email: string, password: string }
// Response: { email: string }
export const register = async (email: string, password: string) => {
  console.log("auth.ts: register function called with email:", email);
  try {
    console.log("auth.ts: Making API request to /api/auth/register");
    const response = await api.post('/api/auth/register', {email, password});
    console.log("auth.ts: Register API response received:", response.data);
    return response.data;
  } catch (error) {
    console.error('auth.ts: Register error:', error);
    console.error('auth.ts: Register error response:', error?.response?.data);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Logout
// Endpoint: POST /api/auth/logout
// Request: {}
// Response: { success: boolean, message: string }
export const logout = async () => {
  console.log("auth.ts: logout function called");
  try {
    console.log("auth.ts: Making API request to /api/auth/logout");
    const response = await api.post('/api/auth/logout');
    console.log("auth.ts: Logout API response received:", response.data);
    return response.data;
  } catch (error) {
    console.error('auth.ts: Logout error:', error);
    console.error('auth.ts: Logout error response:', error?.response?.data);
    throw new Error(error?.response?.data?.message || error.message);
  }
};