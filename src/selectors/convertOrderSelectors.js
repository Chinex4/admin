export const selectConvertOrdersState = (state) => state.convertOrders;

export const selectConvertOrders = (state) =>
  selectConvertOrdersState(state)?.list || [];

export const selectConvertOrdersLoading = (state) =>
  Boolean(selectConvertOrdersState(state)?.loading);

export const selectConvertOrdersError = (state) =>
  selectConvertOrdersState(state)?.error || null;

export const selectConvertOrderActionLoading = (state) =>
  Boolean(selectConvertOrdersState(state)?.actionLoading);

export const selectConvertOrderActionError = (state) =>
  selectConvertOrdersState(state)?.actionError || null;
