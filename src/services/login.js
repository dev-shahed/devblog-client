/**
 * @fileoverview This module handles authentication-related operations for the devblog client.
 * It manages token storage, validation, and login functionality.
 */
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Notification from '../components/Notification';

const TOKEN_KEY = 'devblogToken';

const setToken = (newToken) => {
  const token = `Bearer ${newToken}`;
  localStorage.setItem(TOKEN_KEY, token);
  axios.defaults.headers.common['Authorization'] = token;
};

const getToken = () => localStorage.getItem(TOKEN_KEY);

const isTokenValid = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const login = async (credentials) => {
  try {
    const { data } = await axios.post('/login', credentials);
    setToken(data.token);
    return data;
  } catch (error) {
    Notification.error(
      `Login failed: ${error.response?.data?.error || error.message}`
    );
  }
};

const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  delete axios.defaults.headers.common['Authorization'];
};

const refreshToken = async () => {
  try {
    const { data } = await axios.post('/refresh-token');
    setToken(data.token);
    return data;
  } catch (error) {
    Notification.error(
      `Token refresh failed: ${error.response?.data?.error || error.message}`
    );
  }
};

// Wrap axios to handle token expiration automatically
const withTokenRefresh = async (callback) => {
  if (!isTokenValid(getToken())) {
    await refreshToken();
  }
  return callback();
};

export default {
  setToken,
  getToken,
  isTokenValid,
  login,
  logout,
  refreshToken,
  withTokenRefresh,
};
