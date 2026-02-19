import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const extractPayload = (res) => res?.data?.message ?? res?.data ?? {};

const normalizeListPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.notifications)) return payload.notifications;
  if (Array.isArray(payload?.notification)) return payload.notification;
  if (Array.isArray(payload?.records)) return payload.records;
  if (Array.isArray(payload?.notificationDetails)) return payload.notificationDetails;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.rows)) return payload.rows;
  return [];
};

const buildNotificationPayload = (input = {}) => {
  const title = String(input?.title ?? input?.messageHeader ?? '').trim();
  const body = String(input?.body ?? input?.content ?? '').trim();
  return {
    ...input,
    title,
    body,
    messageHeader: input?.messageHeader ?? title,
    content: input?.content ?? body,
  };
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
      const preparedPayload = buildNotificationPayload(payload);
      const res = await axiosInstance.post('admin/notifications', preparedPayload);
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
      const preparedPayload = buildNotificationPayload(payload);
      const res = await axiosInstance.put(
        `admin/notifications/${id}`,
        preparedPayload
      );
      return {
        id: String(id),
        payload: preparedPayload,
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
      await axiosInstance.delete(`admin/notification/${id}`);
      return String(id);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Failed to delete notification')
      );
    }
  }
);
