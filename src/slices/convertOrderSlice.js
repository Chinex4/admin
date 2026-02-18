import { createSlice } from '@reduxjs/toolkit';
import {
  deleteConvertOrder,
  fetchConvertOrders,
  updateConvertOrder,
} from '../redux/thunks/convertOrderThunk';

const initialState = {
  list: [],
  loading: false,
  error: null,
  actionLoading: false,
  actionError: null,
};

const matchesOrder = (order, id) =>
  String(order?.id) === String(id) || String(order?.convertId) === String(id);

const convertOrderSlice = createSlice({
  name: 'convertOrders',
  initialState,
  reducers: {
    clearConvertOrderActionError: (state) => {
      state.actionError = null;
    },
    clearConvertOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConvertOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConvertOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchConvertOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch convert orders';
      })
      .addCase(updateConvertOrder.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateConvertOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { id, payload, response } = action.payload;
        const index = state.list.findIndex((item) => matchesOrder(item, id));
        if (index === -1) return;
        const incoming = response && typeof response === 'object' ? response : {};
        state.list[index] = {
          ...state.list[index],
          ...payload,
          ...incoming,
        };
      })
      .addCase(updateConvertOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || 'Failed to update convert order';
      })
      .addCase(deleteConvertOrder.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteConvertOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        const id = action.payload;
        state.list = state.list.filter((item) => !matchesOrder(item, id));
      })
      .addCase(deleteConvertOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || 'Failed to delete convert order';
      });
  },
});

export const { clearConvertOrderActionError, clearConvertOrderError } =
  convertOrderSlice.actions;
export default convertOrderSlice.reducer;
