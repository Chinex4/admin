// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: 'http://172.20.10.2/cashtradeproApi/api/task/',
	// baseURL: 'http://172.19.18.22/backend/api/task/',
	baseURL: 'http://192.168.1.238/cashtradeproApi/api/task/',
	// baseURL: 'http://10.84.244.22/backend/api/task/',
	// baseURL: 'http://192.168.1.117/backend/api/task/',
	// baseURL: 'http://192.168.103.22/backend/api/task/',
	// baseURL: 'http://192.168.1.212/backend/api/task/',
	// baseURL: 'https://api.cashtradepro.com/api/task/',
});

// Attach token if exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
