import { createSlice } from '@reduxjs/toolkit';
import {
  createNotification,
  deleteNotification,
  fetchNotifications,
  updateNotification,
} from '../redux/thunks/notificationThunk';

const initialState = {
  list: [],
  loading: false,
  error: null,
  actionLoading: false,
  actionError: null,
};

const matchesNotification = (item, id) =>
  String(item?.id) === String(id) || String(item?.notificationId) === String(id);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotificationActionError: (state) => {
      state.actionError = null;
    },
    clearNotificationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch notifications';
      })
      .addCase(createNotification.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.actionLoading = false;
        const incoming = action.payload;
        if (incoming && typeof incoming === 'object') {
          state.list.unshift(incoming);
        }
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || 'Failed to create notification';
      })
      .addCase(updateNotification.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { id, payload, response } = action.payload;
        const index = state.list.findIndex((item) =>
          matchesNotification(item, id)
        );
        if (index === -1) return;
        const incoming = response && typeof response === 'object' ? response : {};
        state.list[index] = {
          ...state.list[index],
          ...payload,
          ...incoming,
        };
      })
      .addCase(updateNotification.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || 'Failed to update notification';
      })
      .addCase(deleteNotification.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.actionLoading = false;
        const id = action.payload;
        state.list = state.list.filter((item) => !matchesNotification(item, id));
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || 'Failed to delete notification';
      });
  },
});

export const { clearNotificationActionError, clearNotificationError } =
  notificationSlice.actions;
export default notificationSlice.reducer;
