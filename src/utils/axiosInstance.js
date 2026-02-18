// src/utils/axiosInstance.js
import axios from 'axios';

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL ||
//   'https://api.bitspotexchange.com/api/task/';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://10.86.132.204/backend/api/task/';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token if exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
