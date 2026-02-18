import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const extractPayload = (res) => res?.data?.message ?? res?.data ?? {};

const normalizeListPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.fundTransfers)) return payload.fundTransfers;
  if (Array.isArray(payload?.fundTransfer)) return payload.fundTransfer;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.rows)) return payload.rows;
  return [];
};

export const fetchFundTransfers = createAsyncThunk(
  'fundTransfers/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('admin/fundTransfers');
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
      const res = await axiosInstance.put(`admin/fundTransfers/${id}`, payload);
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
      await axiosInstance.delete(`admin/fundTransfers/${id}`);
      return String(id);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to delete fund transfer record')
      );
    }
  }
);
