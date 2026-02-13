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

export const editP2POrder = createAsyncThunk(
  'p2pOrders/edit',
  async ({ orderId, payload }, { rejectWithValue }) => {
    try {
      const res = await runWithFallback([
        () => axiosInstance.put(`admin/p2pOrders/${orderId}`, payload),
        () => axiosInstance.put(`admin/updateP2POrder/${orderId}`, payload),
        () => axiosInstance.put(`admin/p2pOrder/${orderId}`, payload),
      ]);
      const status = Number(res?.status);
      if (status !== 200 && status !== 201) {
        return rejectWithValue(
          `Unexpected response status: ${status || 'unknown'}`
        );
      }
      const data = res?.data?.message ?? res?.data ?? {};
      return { orderId: String(orderId), payload, response: data, status };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to edit P2P order')
      );
    }
  }
);

export const releaseP2POrderForBuy = createAsyncThunk(
  'p2pOrders/releaseForBuy',
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await runWithFallback([
        () => axiosInstance.patch(`admin/releaseP2POrder/${orderId}`),
        () => axiosInstance.patch(`admin/releaseP2POrder/${orderId}`),
        () => axiosInstance.patch(`admin/p2pOrders/release/${orderId}`),
      ]);
      const data = res?.data?.message ?? res?.data ?? {};
      return { orderId: String(orderId), response: data };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to release P2P order for buy')
      );
    }
  }
);

export const deleteP2POrder = createAsyncThunk(
  'p2pOrders/delete',
  async (orderId, { rejectWithValue }) => {
    try {
      await runWithFallback([
        () => axiosInstance.delete(`admin/p2pOrders/${orderId}`),
        () => axiosInstance.delete(`admin/deleteP2POrder/${orderId}`),
      ]);
      return String(orderId);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to delete P2P order')
      );
    }
  }
);
