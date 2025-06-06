// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
	//   baseURL: 'http://192.168.8.189/cashtradeproApi/api/task/',
	baseURL: 'http://192.168.163.134/backend/api/task/',
	// withCredentials: true,
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
