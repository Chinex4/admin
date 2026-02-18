export const selectFundTransfersState = (state) => state.fundTransfers;

export const selectFundTransfers = (state) =>
  selectFundTransfersState(state)?.list || [];

export const selectFundTransfersLoading = (state) =>
  Boolean(selectFundTransfersState(state)?.loading);

export const selectFundTransfersError = (state) =>
  selectFundTransfersState(state)?.error || null;

export const selectFundTransferActionLoading = (state) =>
  Boolean(selectFundTransfersState(state)?.actionLoading);

export const selectFundTransferActionError = (state) =>
  selectFundTransfersState(state)?.actionError || null;
