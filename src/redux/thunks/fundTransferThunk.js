import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const extractPayload = (res) => res?.data?.message ?? res?.data ?? {};

const requestWithFallback = async (requests) => {
  let lastError = null;
  for (const request of requests) {
    try {
      return await request();
    } catch (error) {
      lastError = error;
      const status = Number(error?.response?.status || 0);
      const isRouteMissing = status === 404 || status === 405;
      if (!isRouteMissing) {
        throw error;
      }
    }
  }
  throw lastError || new Error('Endpoint not found');
};

const normalizeListPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.fundTransfers)) return payload.fundTransfers;
  if (Array.isArray(payload?.fundTransfer)) return payload.fundTransfer;
  if (Array.isArray(payload?.internalTransfers)) return payload.internalTransfers;
  if (Array.isArray(payload?.internalTransfer)) return payload.internalTransfer;
  if (Array.isArray(payload?.transfers)) return payload.transfers;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.rows)) return payload.rows;
  return [];
};

export const fetchFundTransfers = createAsyncThunk(
  'fundTransfers/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await requestWithFallback([
        () => axiosInstance.get('admin/fundTransfers'),
        () => axiosInstance.get('admin/internalTransfers'),
        () => axiosInstance.get('admin/fetchFundTransfers'),
        () => axiosInstance.get('admin/fetchInternalTransfers'),
      ]);
      return normalizeListPayload(extractPayload(res));
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to fetch fund transfer records')
      );
    }
  }
);

export const updateFundTransfer = createAsyncThunk(
  'fundTransfers/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await requestWithFallback([
        () => axiosInstance.put(`admin/fundTransfers/${id}`, payload),
        () => axiosInstance.put(`admin/internalTransfers/${id}`, payload),
        () => axiosInstance.patch(`admin/fundTransfers/${id}`, payload),
        () => axiosInstance.patch(`admin/internalTransfers/${id}`, payload),
        () => axiosInstance.patch(`admin/updateFundTransfer/${id}`, payload),
      ]);
      return {
        id: String(id),
        payload,
        response: extractPayload(res),
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to update fund transfer record')
      );
    }
  }
);

export const deleteFundTransfer = createAsyncThunk(
  'fundTransfers/delete',
  async (id, { rejectWithValue }) => {
    try {
      await requestWithFallback([
        () => axiosInstance.delete(`admin/fundTransfers/${id}`),
        () => axiosInstance.delete(`admin/internalTransfers/${id}`),
        () => axiosInstance.delete(`admin/deleteFundTransfer/${id}`),
      ]);
      return String(id);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to delete fund transfer record')
      );
    }
  }
);
