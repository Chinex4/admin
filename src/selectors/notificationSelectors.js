export const selectNotificationsState = (state) => state.notifications;

export const selectNotifications = (state) =>
  selectNotificationsState(state)?.list || [];

export const selectNotificationsLoading = (state) =>
  Boolean(selectNotificationsState(state)?.loading);

export const selectNotificationsError = (state) =>
  selectNotificationsState(state)?.error || null;

export const selectNotificationActionLoading = (state) =>
  Boolean(selectNotificationsState(state)?.actionLoading);

export const selectNotificationActionError = (state) =>
  selectNotificationsState(state)?.actionError || null;
