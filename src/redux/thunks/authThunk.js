// redux/thunks/authThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

export const loginUser = createAsyncThunk(
	'auth/loginUser',
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.post('/login', credentials); // 🔁 Adjust endpoint if needed
			const { token, user } = response.data;
			localStorage.setItem('token', token);
			localStorage.setItem('user', JSON.stringify(user));
			toast.success('Logged in successfully');
			return { token, user };
		} catch (error) {
			toast.error(error?.response?.data?.message || 'Login failed');
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
	localStorage.removeItem('token');
	localStorage.removeItem('user');
	toast.success('Logged out');
});
