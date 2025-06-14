import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

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
