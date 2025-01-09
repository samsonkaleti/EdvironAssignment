// src/services/authService.js
import axios from 'axios';

export const login = async (credentials) => {
  const response = await axios.post('https://edvironassignment.onrender.com/api/auth/login', credentials);
  return response.data.token;
};

export const signup = async (credentials) => {
  await axios.post('https://edvironassignment.onrender.com/api/auth/signup', credentials);
};

