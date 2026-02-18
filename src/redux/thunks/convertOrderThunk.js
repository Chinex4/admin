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

const extractPayload = (res) => res?.data?.message ?? res?.data ?? {};

const normalizeListPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.convertOrders)) return payload.convertOrders;
  if (Array.isArray(payload?.convertOrder)) return payload.convertOrder;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.rows)) return payload.rows;
  return [];
};

export const fetchConvertOrders = createAsyncThunk(
  'convertOrders/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await runWithFallback([
        () => axiosInstance.get('admin/convertOrders'),
        () => axiosInstance.get('admin/convertOrder'),
        () => axiosInstance.get('admin/fetchConvertOrder'),
        () => axiosInstance.get('admin/fetchConvertOrders'),
      ]);
      return normalizeListPayload(extractPayload(res));
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to fetch convert orders')
      );
    }
  }
);

export const updateConvertOrder = createAsyncThunk(
  'convertOrders/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await runWithFallback([
        () => axiosInstance.put(`admin/convertOrders/${id}`, payload),
        () => axiosInstance.put(`admin/convertOrder/${id}`, payload),
        () => axiosInstance.put(`admin/updateConvertOrder/${id}`, payload),
        () => axiosInstance.put(`admin/editConvertOrder/${id}`, payload),
      ]);
      return {
        id: String(id),
        payload,
        response: extractPayload(res),
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to update convert order')
      );
    }
  }
);

export const deleteConvertOrder = createAsyncThunk(
  'convertOrders/delete',
  async (id, { rejectWithValue }) => {
    try {
      await runWithFallback([
        () => axiosInstance.delete(`admin/convertOrders/${id}`),
        () => axiosInstance.delete(`admin/convertOrder/${id}`),
        () => axiosInstance.delete(`admin/deleteConvertOrder/${id}`),
      ]);
      return String(id);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to delete convert order')
      );
    }
  }
);
