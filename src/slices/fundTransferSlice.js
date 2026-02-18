import { createSlice } from '@reduxjs/toolkit';
import {
  deleteFundTransfer,
  fetchFundTransfers,
  updateFundTransfer,
} from '../redux/thunks/fundTransferThunk';

const initialState = {
  list: [],
  loading: false,
  error: null,
  actionLoading: false,
  actionError: null,
};

const matchesTransfer = (transfer, id) =>
  String(transfer?.id) === String(id) ||
  String(transfer?.transferId) === String(id);

const fundTransferSlice = createSlice({
  name: 'fundTransfers',
  initialState,
  reducers: {
    clearFundTransferActionError: (state) => {
      state.actionError = null;
    },
    clearFundTransferError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFundTransfers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFundTransfers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchFundTransfers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch fund transfer records';
      })
      .addCase(updateFundTransfer.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateFundTransfer.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { id, payload, response } = action.payload;
        const index = state.list.findIndex((item) => matchesTransfer(item, id));
        if (index === -1) return;
        const incoming = response && typeof response === 'object' ? response : {};
        state.list[index] = {
          ...state.list[index],
          ...payload,
          ...incoming,
        };
      })
      .addCase(updateFundTransfer.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || 'Failed to update fund transfer';
      })
      .addCase(deleteFundTransfer.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteFundTransfer.fulfilled, (state, action) => {
        state.actionLoading = false;
        const id = action.payload;
        state.list = state.list.filter((item) => !matchesTransfer(item, id));
      })
      .addCase(deleteFundTransfer.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || 'Failed to delete fund transfer';
      });
  },
});

export const { clearFundTransferActionError, clearFundTransferError } =
  fundTransferSlice.actions;
export default fundTransferSlice.reducer;
