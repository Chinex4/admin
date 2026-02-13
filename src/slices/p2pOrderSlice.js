import { createSlice } from '@reduxjs/toolkit';
import {
  deleteP2POrder,
  editP2POrder,
  releaseP2POrderForBuy,
} from '../redux/thunks/p2pOrdersThunk';

const initialState = {
  orders: [],
  actionLoading: false,
  actionError: null,
};

const matchesOrder = (order, orderId) =>
  String(order?.id) === String(orderId) || String(order?.orderId) === String(orderId);

const p2pOrderSlice = createSlice({
  name: 'p2pOrders',
  initialState,
  reducers: {
    setP2POrders: (state, action) => {
      state.orders = action.payload;
    },
    clearP2POrderActionError: (state) => {
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editP2POrder.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(editP2POrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { orderId, payload, response } = action.payload;
        const index = state.orders.findIndex((order) => matchesOrder(order, orderId));
        if (index === -1) return;
        const incoming = response && typeof response === 'object' ? response : {};
        state.orders[index] = {
          ...state.orders[index],
          ...payload,
          ...incoming,
        };
      })
      .addCase(editP2POrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || 'Failed to edit P2P order';
      })
      .addCase(releaseP2POrderForBuy.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(releaseP2POrderForBuy.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { orderId, response } = action.payload;
        const index = state.orders.findIndex((order) => matchesOrder(order, orderId));
        if (index === -1) return;
        const incoming = response && typeof response === 'object' ? response : {};
        state.orders[index] = {
          ...state.orders[index],
          userRelease: 'Yes',
          ...incoming,
        };
      })
      .addCase(releaseP2POrderForBuy.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || 'Failed to release P2P order';
      })
      .addCase(deleteP2POrder.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteP2POrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.orders = state.orders.filter(
          (order) => !matchesOrder(order, action.payload)
        );
      })
      .addCase(deleteP2POrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || 'Failed to delete P2P order';
      });
  },
});

export const { setP2POrders, clearP2POrderActionError } = p2pOrderSlice.actions;
export default p2pOrderSlice.reducer;
