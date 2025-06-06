// src/redux/user/usersThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// ✅ 1. Update user
export const updateUser = createAsyncThunk(
	'users/updateUser',
	async (userData, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.put(
				`admin/updateUser/${userData.id}`,
				userData
			);
			return response.data.updatedUser;
		} catch (err) {
			return rejectWithValue(
				err.response?.data?.message || 'Failed to update user'
			);
		}
	}
);

// ✅ 2. Delete User
export const deleteUser = createAsyncThunk(
	'users/deleteUser',
	async (userId, { rejectWithValue }) => {
		try {
			await axiosInstance.delete(`admin/deleteUser/${userId}`);
			return userId;
		} catch (err) {
			return rejectWithValue(
				err.response?.data?.message || 'Failed to delete user'
			);
		}
	}
);

// ✅ 3. Disable User Login
export const disableUserLogin = createAsyncThunk(
	'users/disableUserLogin',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.post(`admin/disableLogin/${userId}`);
			return res.data.updatedUser;
		} catch (err) {
			return rejectWithValue('Failed to disable user login');
		}
	}
);

// ✅ 4. Enable User Login
export const enableUserLogin = createAsyncThunk(
	'users/enableUserLogin',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.post(`admin/enableLogin/${userId}`);
			return res.data.updatedUser;
		} catch (err) {
			return rejectWithValue('Failed to enable user login');
		}
	}
);

// ✅ 5. Disable Alert Message
export const disableAlertMessage = createAsyncThunk(
	'users/disableAlertMessage',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.post(`admin/disableAlert/${userId}`);
			return res.data.updatedUser;
		} catch (err) {
			return rejectWithValue('Failed to disable alert message');
		}
	}
);

// ✅ 6. Enable Alert Message
export const enableAlertMessage = createAsyncThunk(
	'users/enableAlertMessage',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.post(`admin/enableAlert/${userId}`);
			return res.data.updatedUser;
		} catch (err) {
			return rejectWithValue('Failed to enable alert message');
		}
	}
);

// ✅ 7. Disable KYC
export const disableKyc = createAsyncThunk(
	'users/disableKyc',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.post(`admin/disableKyc/${userId}`);
			return res.data.updatedUser;
		} catch (err) {
			return rejectWithValue('Failed to disable KYC');
		}
	}
);

// ✅ 8. Enable KYC
export const enableKyc = createAsyncThunk(
	'users/enableKyc',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.post(`admin/enableKyc/${userId}`);
			return res.data.updatedUser;
		} catch (err) {
			return rejectWithValue('Failed to enable KYC');
		}
	}
);

// ✅ 9. Resend Verification Email
export const resendVerificationEmail = createAsyncThunk(
	'users/resendVerificationEmail',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.post(
				`admin/resendVerification/${userId}`
			);
			return res.data.message;
		} catch (err) {
			return rejectWithValue('Failed to resend verification email');
		}
	}
);

// ✅ 10. Disable OTP Login
export const disableOtpLogin = createAsyncThunk(
	'users/disableOtpLogin',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.post(`admin/disableOtp/${userId}`);
			return res.data.updatedUser;
		} catch (err) {
			return rejectWithValue('Failed to disable OTP login');
		}
	}
);
