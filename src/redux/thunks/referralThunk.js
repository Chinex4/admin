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
  if (Array.isArray(payload?.referrals)) return payload.referrals;
  if (Array.isArray(payload?.referral)) return payload.referral;
  if (Array.isArray(payload?.records)) return payload.records;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.rows)) return payload.rows;
  return [];
};

const toComparableId = (value) =>
  value === null || value === undefined ? '' : String(value).trim();

const getReferralId = (item) =>
  toComparableId(item?.id ?? item?.referralId ?? item?.referral_id);

const normalizeDetailPayload = (payload) => {
  if (!payload) return {};
  if (Array.isArray(payload)) return payload[0] ?? {};
  if (payload.record && typeof payload.record === 'object') return payload.record;
  if (payload.referral && typeof payload.referral === 'object') return payload.referral;
  if (payload.details && typeof payload.details === 'object') return payload.details;
  if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    return payload.data;
  }
  return typeof payload === 'object' ? payload : {};
};

const fetchReferralDetail = async (id) => {
  const res = await requestWithFallback([
    () => axiosInstance.get(`admin/referral/${id}`),
    () => axiosInstance.get(`admin/referrals/${id}`),
    () => axiosInstance.get(`admin/fetchReferral/${id}`),
    () => axiosInstance.get(`admin/fetchReferrals/${id}`),
  ]);
  return normalizeDetailPayload(extractPayload(res));
};

const mergeDefinedValues = (baseItem, details) => {
  if (!details || typeof details !== 'object') return baseItem;
  const definedOnly = Object.entries(details).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});
  return {
    ...baseItem,
    ...definedOnly,
  };
};

export const fetchReferrals = createAsyncThunk(
  'referrals/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await requestWithFallback([
        () => axiosInstance.get('admin/referrals'),
        () => axiosInstance.get('admin/referral'),
      ]);
      const list = normalizeListPayload(extractPayload(res));
      const detailed = await Promise.all(
        list.map(async (item) => {
          const id = getReferralId(item);
          if (!id) return item;
          try {
            const details = await fetchReferralDetail(id);
            return mergeDefinedValues(item, details);
          } catch {
            return item;
          }
        })
      );
      return detailed;
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
      const res = await requestWithFallback([
        () => axiosInstance.put(`admin/referral/${id}`, payload),
        () => axiosInstance.put(`admin/referrals/${id}`, payload),
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
      await requestWithFallback([
        () => axiosInstance.delete(`admin/referral/${id}`),
        () => axiosInstance.delete(`admin/referrals/${id}`),
      ]);
      return String(id);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to delete referral record')
      );
    }
  }
);

export const approveReferral = createAsyncThunk(
  'referrals/approve',
  async ({ id, amount }, { rejectWithValue }) => {
    try {
      const parsedAmount = Number(amount);
      const hasValidAmount = Number.isFinite(parsedAmount) && parsedAmount > 0;
      const payload = {
        approveReferral: true,
        status: 'approved',
      };
      if (hasValidAmount) {
        payload.amount = parsedAmount;
        payload.amtEarned = parsedAmount;
        payload.referralAmount = parsedAmount;
      }
      const res = await requestWithFallback([
        () => axiosInstance.put(`admin/referral/${id}`, payload),
        () => axiosInstance.patch(`admin/referral/${id}`, payload),
        () =>
          axiosInstance.put(`admin/referrals/${id}`, payload),
        () => axiosInstance.patch(`admin/referrals/${id}`, payload),
      ]);
      return {
        id: String(id),
        amount: hasValidAmount ? parsedAmount : null,
        status: 'approved',
        response: extractPayload(res),
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to approve referral')
      );
    }
  }
);

export const disapproveReferral = createAsyncThunk(
  'referrals/disapprove',
  async (id, { rejectWithValue }) => {
    try {
      const payload = {
        disapproveReferral: true,
        approveReferral: false,
        status: 'disapproved',
      };
      const res = await requestWithFallback([
        () => axiosInstance.put(`admin/referral/${id}`, payload),
        () => axiosInstance.patch(`admin/referral/${id}`, payload),
        () => axiosInstance.put(`admin/referrals/${id}`, payload),
        () => axiosInstance.patch(`admin/referrals/${id}`, payload),
      ]);
      return {
        id: String(id),
        status: 'disapproved',
        response: extractPayload(res),
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to disapprove referral')
      );
    }
  }
);
