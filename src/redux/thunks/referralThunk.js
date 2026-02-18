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
      const res = await runWithFallback([
        () => axiosInstance.get('admin/referrals'),
        () => axiosInstance.get('admin/referral'),
        () => axiosInstance.get('admin/fetchReferral'),
        () => axiosInstance.get('admin/fetchReferrals'),
      ]);
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
      const res = await runWithFallback([
        () => axiosInstance.put(`admin/referrals/${id}`, payload),
        () => axiosInstance.put(`admin/referral/${id}`, payload),
        () => axiosInstance.put(`admin/updateReferral/${id}`, payload),
        () => axiosInstance.put(`admin/editReferral/${id}`, payload),
      ]);
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
      await runWithFallback([
        () => axiosInstance.delete(`admin/referrals/${id}`),
        () => axiosInstance.delete(`admin/referral/${id}`),
        () => axiosInstance.delete(`admin/deleteReferral/${id}`),
      ]);
      return String(id);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to delete referral record')
      );
    }
  }
);
