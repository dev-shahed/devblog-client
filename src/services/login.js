import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Notification from '../components/Notification';

let token = null;

// Set the authorization token and store it
const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
  window.localStorage.setItem('token', token);
  axios.defaults.headers.common['Authorization'] = token;
};

// Get the stored token
const getToken = () => token || window.localStorage.getItem('token');

// Check if token is expired
const isTokenValid = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000 > Date.now(); // Compare expiration time
  } catch {
    return false;
  }
};

// Handle login and store user data/token
const login = async (credentials) => {
  try {
    const response = await axios.post('/login', credentials);
    const userData = response.data;

    // Store user data and token in localStorage
    window.localStorage.setItem('devblogUser', JSON.stringify(userData));
    setToken(userData.token);

    Notification.success('Logged in successfully');
    return userData;
  } catch (error) {
    Notification.error(error.response?.data?.error || 'Login failed');
    throw new Error(error.response?.data?.error || 'Login failed');
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

// Automatically log out if token is expired
const handleTokenExpiration = (error) => {
  if (error.response && error.response.status === 401) {
    Notification.error('Session expired. Please log in again.');
    logout();
  }
  return Promise.reject(error);
};

// Add Axios response interceptor to catch expired tokens
axios.interceptors.response.use(
  (response) => response, // Pass successful responses
  (error) => handleTokenExpiration(error) // Handle token expiration
);

export default { login, logout, setToken, getToken, isTokenValid };
