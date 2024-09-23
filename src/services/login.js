import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Fixed import (no need for destructuring)
import Notification from '../components/Notification';

let token = null;

// Set the authorization token and store it
const setToken = (newToken) => {
  token = newToken;
  window.localStorage.setItem('token', token); // Store raw token
  axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`; // Prepend "Bearer"
};

// Get the stored token
const getToken = () => {
  const storedToken = token || window.localStorage.getItem('token');
  return storedToken ? `Bearer ${storedToken}` : null; // Return with "Bearer" prefix
};

// Check if token is valid (not expired)
const isTokenValid = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000 > Date.now(); // Token expiration time in milliseconds
  } catch {
    return false; // If decoding fails, treat as invalid
  }
};

// Handle login and store user data/token
const login = async (credentials) => {
  try {
    const response = await axios.post('/login', credentials);
    const userData = response.data;
    // Store user data and token in localStorage
    window.localStorage.setItem('devblogUser', JSON.stringify(userData));
    setToken(userData.token); // Store token and set authorization header
    Notification.success('Logged in successfully');
    return userData;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Login failed';
    Notification.error(errorMessage);
    throw errorMessage;
  }
};

// Handle logout and remove user data/token
const logout = () => {
  token = null;
  window.localStorage.removeItem('devblogUser');
  window.localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
  window.location.href = '/login'; // Redirect to login page after logout
};

// Handle expired tokens (for requests with tokens)
const handleTokenExpiration = (error) => {
  if (error.response && error.response.status === 401) {
    const storedToken = window.localStorage.getItem('token');

    if (storedToken && !isTokenValid(storedToken)) {
      Notification.error('Session expired. Please log in again.');
      logout(); // Automatically log out
    }
  }
  return Promise.reject(error); // Pass the error to the next handler
};

// Add Axios response interceptor to catch expired tokens globally
axios.interceptors.response.use(
  (response) => response, // Pass successful responses
  (error) => handleTokenExpiration(error) // Handle expired tokens
);

// Automatically add authorization header to every request if token exists
axios.interceptors.request.use((config) => {
  const authToken = window.localStorage.getItem('token');
  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken}`;
  }
  return config;
});

export default { login, logout, setToken, getToken, isTokenValid };
