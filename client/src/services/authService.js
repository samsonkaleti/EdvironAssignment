// src/services/authService.js
import axios from 'axios';

export const login = async (credentials) => {
  const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
  return response.data.token;
};

export const signup = async (credentials) => {
  await axios.post('http://localhost:8080/api/auth/signup', credentials);
};

