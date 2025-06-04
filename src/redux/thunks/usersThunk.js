import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { showError } from '../../utils/toast'; // optional

export const fetchUsers = createAsyncThunk(
	'users/fetchUsers',
	async (_, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.get('user/fetchAlluser');
			return res.data; // ensure backend returns JSON array of users
		} catch (err) {
			showError(err?.response?.data?.message || 'Failed to fetch users'); // optional
			return rejectWithValue(err.response?.data);
		}
	}
);
