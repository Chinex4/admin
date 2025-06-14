import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Update Wallet Thunk
export const addWallet = createAsyncThunk(
  'wallets/addWallet',
  async (walletData, { rejectWithValue }) => {
    try {
      const { id, ...body } = walletData;  
      const res = await axiosInstance.post(`admin/addWallet/${id}`, body);
      return res.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Unknown error');
    }
  }
);
// Update Wallet Thunk
export const updateWallet = createAsyncThunk(
  'wallets/updateWallet',
  async (walletData, { rejectWithValue }) => {
    try {
      const { id, ...body } = walletData;  
      const res = await axiosInstance.put(`admin/updateWallet/${id}`, body);
      return res.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Unknown error');
    }
  }
);

// Delete Wallet Thunk
export const deleteWallet = createAsyncThunk(
  'wallets/deleteWallet',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`admin/deleteWallet/${id}`);
      return id; // Return deleted wallet id for local removal
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Unknown error');
    }
  }
);
