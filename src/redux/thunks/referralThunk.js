import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const extractPayload = (res) => res?.data?.message ?? res?.data ?? {};

const normalizeListPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.referrals)) return payload.referrals;
  if (Array.isArray(payload?.referral)) return payload.referral;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.rows)) return payload.rows;
  return [];
};

export const fetchReferrals = createAsyncThunk(
  'referrals/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('admin/referrals');
      return normalizeListPayload(extractPayload(res));
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to fetch referral records')
      );
    }
  }
);

export const updateReferral = createAsyncThunk(
  'referrals/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`admin/referrals/${id}`, payload);
      return {
        id: String(id),
        payload,
        response: extractPayload(res),
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to update referral record')
      );
    }
  }
);

export const deleteReferral = createAsyncThunk(
  'referrals/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`admin/referrals/${id}`);
      return String(id);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to delete referral record')
      );
    }
  }
);
