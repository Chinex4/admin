// src/redux/user/usersThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// ✅ 1. Update user
export const updateUser = createAsyncThunk(
	'admin/updateUser',
	async (userData, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.put(
				`admin/updateUser/${userData.accToken}`,
				userData
			);
			return response;
		} catch (err) {
			return rejectWithValue(
				err.response?.data?.message || 'Failed to update user'
			);
		}
	}
);

// ✅ 2. Delete User
export const deleteUser = createAsyncThunk(
	'admin/deleteUser',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.delete(`admin/deleteUser/${userId}`);
			return res;
		} catch (err) {
			return rejectWithValue(
				err.response?.data?.message || 'Failed to delete user'
			);
		}
	}
);

// ✅ 3. Disable User Login
export const disableUserLogin = createAsyncThunk(
	'admin/disableUserLogin',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.patch(`admin/disableLogin/${userId}`);
			return res;
		} catch (err) {
			return rejectWithValue(err ||'Failed to disable user login');
		}
	}
);

// ✅ 4. Enable User Login
export const enableUserLogin = createAsyncThunk(
	'admin/enableUserLogin',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.patch(`admin/enableLogin/${userId}`);
			return res;
		} catch (err) {
			return rejectWithValue( err ||'Failed to enable user login');
		}
	}
);

// ✅ 5. Disable Alert Message
export const disableAlertMessage = createAsyncThunk(
	'admin/disableAlertMessage',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.patch(`admin/disableAlert/${userId}`);
			return res;
		} catch (err) {
			return rejectWithValue( err ||'Failed to disable alert message');
		}
	}
);

// ✅ 6. Enable Alert Message
export const enableAlertMessage = createAsyncThunk(
	'admin/enableAlertMessage',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.patch(`admin/enableAlert/${userId}`);
			return res;
		} catch (err) {
			return rejectWithValue( err ||'Failed to enable alert message');
		}
	}
);

// ✅ 7. Disable KYC
export const disableKyc = createAsyncThunk(
	'admin/disableKyc',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.patch(`admin/disableKyc/${userId}`);
			return res;
		} catch (err) {
			return rejectWithValue( err ||'Failed to disable KYC');
		}
	}
);

// ✅ 8. Enable KYC
export const enableKyc = createAsyncThunk(
	'admin/enableKyc',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.patch(`admin/enableKyc/${userId}`);
			return res;
		} catch (err) {
			return rejectWithValue( err ||'Failed to enable KYC');
		}
	}
);

// ✅ 9. Resend Verification Email
export const resendVerificationEmail = createAsyncThunk(
	'admin/resendVerificationEmail',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.post(
				`admin/resendVerification`,{userId}
			);
			return res;
		} catch (err) {
			return rejectWithValue( err ||'Failed to resend verification email');
		}
	}
);

// ✅ 10. Disable OTP Login
export const disableOtpLogin = createAsyncThunk(
	'admin/disableOtpLogin',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.patch(`admin/disableOtp/${userId}`);
			return res;
		} catch (err) {
			return rejectWithValue( err ||'Failed to disable OTP login');
		}
	}
);
export const enableOtpLogin = createAsyncThunk(
	'admin/enableOtpLogin',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.patch(`admin/enableOtp/${userId}`);
			return res;
		} catch (err) {
			return rejectWithValue( err ||'Failed to enable OTP login');
		}
	}
);

// ✅ 11. Update User Crypto Balances
export const updateUserBalances = createAsyncThunk(
	'admin/updateUserBalances',
	async ({ accToken, balances_json }, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.put(
				`admin/updateUserBalances/${accToken}`,
				{ balances_json }
			);
			return res;
		} catch (err) {
			return rejectWithValue(
				err.response?.data?.message || 'Failed to update user balances'
			);
		}
	}
);

// ✅ 12. Fund user account from admin modal
export const fundUserAccount = createAsyncThunk(
	'admin/fundUser',
	async ({ accToken, ...payload }, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.patch(`admin/fundUser/${accToken}`, payload);
			return res;
		} catch (err) {
			return rejectWithValue(
				err?.response?.data?.errors ||
					err?.response?.data?.message ||
					'Failed to fund user account'
			);
		}
	}
);

// ✅ 13. Add profit to user's earn account and total asset
export const addUserProfit = createAsyncThunk(
	'admin/addUserProfit',
	async ({ accToken, ...payload }, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.patch(
				`admin/addUserProfit/${accToken}`,
				payload
			);
			return res;
		} catch (err) {
			return rejectWithValue(
				err?.response?.data?.errors ||
					err?.response?.data?.message ||
					'Failed to add profit'
			);
		}
	}
);

// ✅ 14. Apply loss to user's earn account and total asset
export const addUserLoss = createAsyncThunk(
	'admin/addUserLoss',
	async ({ accToken, ...payload }, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.patch(`admin/addUserLoss/${accToken}`, payload);
			return res;
		} catch (err) {
			return rejectWithValue(
				err?.response?.data?.errors ||
					err?.response?.data?.message ||
					'Failed to apply loss'
			);
		}
	}
);

export const disableUserTrade = createAsyncThunk(
	'admin/disableUserTrade',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.patch(`admin/disableTrade/${userId}`);
			return res;
		} catch (err) {
			return rejectWithValue(err || 'Failed to disable user trade');
		}
	}
);

export const enableUserTrade = createAsyncThunk(
	'admin/enableUserTrade',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.patch(`admin/enableTrade/${userId}`);
			return res;
		} catch (err) {
			return rejectWithValue(err || 'Failed to enable user trade');
		}
	}
);

export const disableUserDeposit = createAsyncThunk(
	'admin/disableUserDeposit',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.patch(`admin/disableDeposit/${userId}`);
			return res;
		} catch (err) {
			return rejectWithValue(err || 'Failed to disable user deposits');
		}
	}
);

export const enableUserDeposit = createAsyncThunk(
	'admin/enableUserDeposit',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.patch(`admin/enableDeposit/${userId}`);
			return res;
		} catch (err) {
			return rejectWithValue(err || 'Failed to enable user deposits');
		}
	}
);

export const disableUserWithdrawal = createAsyncThunk(
	'admin/disableUserWithdrawal',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.patch(`admin/disableWithdrawal/${userId}`);
			return res;
		} catch (err) {
			return rejectWithValue(err || 'Failed to disable user withdrawals');
		}
	}
);

export const enableUserWithdrawal = createAsyncThunk(
	'admin/enableUserWithdrawal',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.patch(`admin/enableWithdrawal/${userId}`);
			return res;
		} catch (err) {
			return rejectWithValue(err || 'Failed to enable user withdrawals');
		}
	}
);

export const logoutUserSession = createAsyncThunk(
	'admin/logoutUserSession',
	async (userId, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.patch(`admin/logoutUser/${userId}`);
			return res;
		} catch (err) {
			return rejectWithValue(err || 'Failed to log out user session');
		}
	}
);
