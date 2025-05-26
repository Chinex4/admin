// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'https://your-backend-api.com/api', // ✅ replace with your actual API URL
	headers: {
		'Content-Type': 'application/json',
	},
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
