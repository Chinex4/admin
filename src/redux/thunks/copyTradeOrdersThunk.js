import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const runWithFallback = async (requests) => {
  let lastError;
  for (const request of requests) {
    try {
      return await request();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};

export const editCopyTradeOrder = createAsyncThunk(
  'copiedTraders/editCopyTradeOrder',
  async ({ orderId, payload }, { rejectWithValue }) => {
    try {
      const res = await runWithFallback([
        () => axiosInstance.put(`admin/copytradeorderr/${orderId}`, payload),
        () => axiosInstance.put(`admin/updatecopytradeorderr/${orderId}`, payload),
        () => axiosInstance.put(`admin/editcopytradeorderr/${orderId}`, payload),
      ]);
      const data = res?.data?.message ?? res?.data ?? {};
      return { orderId: String(orderId), payload, response: data };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to edit copy trade order')
      );
    }
  }
);

export const deleteCopyTradeOrder = createAsyncThunk(
  'copiedTraders/deleteCopyTradeOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      await runWithFallback([
        () => axiosInstance.delete(`admin/copytradeorderr/${orderId}`),
        () => axiosInstance.delete(`admin/deletecopytradeorderr/${orderId}`),
      ]);
      return String(orderId);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to delete copy trade order')
      );
    }
  }
);

export const approveCopyTradeOrder = createAsyncThunk(
  'copiedTraders/approveCopyTradeOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `admin/approvecopytradeorderr/${orderId}`
      );
      const data = res?.data?.message ?? res?.data ?? {};
      return { orderId: String(orderId), response: data, status: 'approved' };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to approve copy trade order')
      );
    }
  }
);

export const disapproveCopyTradeOrder = createAsyncThunk(
  'copiedTraders/disapproveCopyTradeOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `admin/disapprovecopytradeorderr/${orderId}`
      );
      const data = res?.data?.message ?? res?.data ?? {};
      return { orderId: String(orderId), response: data, status: 'disapproved' };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to disapprove copy trade order')
      );
    }
  }
);
