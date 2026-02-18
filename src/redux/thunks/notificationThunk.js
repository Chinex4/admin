import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const extractPayload = (res) => res?.data?.message ?? res?.data ?? {};

const normalizeListPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.notifications)) return payload.notifications;
  if (Array.isArray(payload?.notification)) return payload.notification;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.rows)) return payload.rows;
  return [];
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('admin/notifications');
      return normalizeListPayload(extractPayload(res));
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to fetch notifications')
      );
    }
  }
);

export const createNotification = createAsyncThunk(
  'notifications/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('admin/notifications', payload);
      return extractPayload(res);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to create notification')
      );
    }
  }
);

export const updateNotification = createAsyncThunk(
  'notifications/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`admin/notifications/${id}`, payload);
      return {
        id: String(id),
        payload,
        response: extractPayload(res),
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to update notification')
      );
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`admin/notifications/${id}`);
      return String(id);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to delete notification')
      );
    }
  }
);
