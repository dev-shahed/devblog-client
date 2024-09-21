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
    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const login = async (credentials) => {
  try {
    const { data: userData } = await axios.post('/login', credentials);
    setToken(userData.token);
    return userData;
  } catch (error) {
    Notification.error('Login failed: ' + (error.response?.data?.error || error.message));
  }
};

const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  delete axios.defaults.headers.common['Authorization'];
};

const refreshToken = async () => {
  try {
    const { data: newUserData } = await axios.post('/refresh-token');
    setToken(newUserData.token);
    return newUserData;
  } catch (error) {
    Notification.error('Token refresh failed: ' + (error.response?.data?.error || error.message));
  }
};

export default {
  setToken,
  getToken,
  isTokenValid,
  login,
  logout,
  refreshToken
};
