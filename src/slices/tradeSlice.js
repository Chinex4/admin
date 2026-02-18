// src/slices/tradeSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  deleteTradeOrder,
  editTradeOrder,
  lossTradeOrder,
  winTradeOrder,
} from '../redux/thunks/tradeActionsThunk';

const initialState = {
  trades: [],
  selectedTrade: null,
  tradeModalType: null,
  actionError: null,
  actionLoading: false,
};

const findTradeIndex = (trades, id) =>
  trades.findIndex(
    (trade) =>
      String(trade?.id) === String(id) || String(trade?.orderId) === String(id)
  );

const tradeSlice = createSlice({
  name: 'trades',
  initialState,
  reducers: {
    setTrades: (state, action) => {
      state.trades = action.payload;
    },
    setSelectedTrade: (state, action) => {
      state.selectedTrade = action.payload;
    },
    setTradeModalType: (state, action) => {
      state.tradeModalType = action.payload;
    },
    clearTradeModal: (state) => {
      state.selectedTrade = null;
      state.tradeModalType = null;
    },
    markTradeWin: (state, action) => {
      const { id, amount } = action.payload;
      const index = findTradeIndex(state.trades, id);
      if (index === -1) return;
      state.trades[index].outcome = `Won: ${amount}`;
      state.trades[index].status = 'WON';
    },
    markTradeLoss: (state, action) => {
      const { id, amount } = action.payload;
      const index = findTradeIndex(state.trades, id);
      if (index === -1) return;
      state.trades[index].outcome = `Lost: ${amount}`;
      state.trades[index].status = 'LOST';
    },
    editTradeDetails: (state, action) => {
      const { id, changes } = action.payload;
      const index = findTradeIndex(state.trades, id);
      if (index === -1) return;
      state.trades[index] = {
        ...state.trades[index],
        ...(changes || {}),
      };
    },
    deleteTrade: (state, action) => {
      state.trades = state.trades.filter(
        (trade) =>
          String(trade?.id) !== String(action.payload) &&
          String(trade?.orderId) !== String(action.payload)
      );
    },
    setTradeActionError: (state, action) => {
      state.actionError = action.payload || null;
    },
    clearTradeActionError: (state) => {
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editTradeOrder.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(editTradeOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { tradeId, payload, response } = action.payload;
        const index = findTradeIndex(state.trades, tradeId);
        if (index === -1) return;
        const incoming =
          response?.trade && typeof response.trade === 'object'
            ? response.trade
            : response && typeof response === 'object'
              ? response
              : {};
        state.trades[index] = {
          ...state.trades[index],
          ...(payload || {}),
          ...incoming,
        };
      })
      .addCase(editTradeOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || 'Failed to edit trade details';
      })
      .addCase(winTradeOrder.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(winTradeOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { tradeId, amount, response } = action.payload;
        const index = findTradeIndex(state.trades, tradeId);
        if (index === -1) return;
        const incoming =
          response?.trade && typeof response.trade === 'object'
            ? response.trade
            : response && typeof response === 'object'
              ? response
              : {};
        state.trades[index] = {
          ...state.trades[index],
          ...incoming,
          status: incoming.status ?? 'WON',
          outcome: incoming.outcome ?? `Won: ${amount}`,
        };
      })
      .addCase(winTradeOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || 'Failed to mark trade as win';
      })
      .addCase(lossTradeOrder.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(lossTradeOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { tradeId, amount, response } = action.payload;
        const index = findTradeIndex(state.trades, tradeId);
        if (index === -1) return;
        const incoming =
          response?.trade && typeof response.trade === 'object'
            ? response.trade
            : response && typeof response === 'object'
              ? response
              : {};
        state.trades[index] = {
          ...state.trades[index],
          ...incoming,
          status: incoming.status ?? 'LOST',
          outcome: incoming.outcome ?? `Lost: ${amount}`,
        };
      })
      .addCase(lossTradeOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || 'Failed to mark trade as loss';
      })
      .addCase(deleteTradeOrder.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteTradeOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        const tradeId = action.payload;
        state.trades = state.trades.filter(
          (trade) =>
            String(trade?.id) !== String(tradeId) &&
            String(trade?.orderId) !== String(tradeId)
        );
      })
      .addCase(deleteTradeOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || 'Failed to delete trade';
      });
  },
});

export const {
  setTrades,
  setSelectedTrade,
  setTradeModalType,
  clearTradeModal,
  markTradeWin,
  markTradeLoss,
  editTradeDetails,
  deleteTrade,
  setTradeActionError,
  clearTradeActionError,
} = tradeSlice.actions;

export default tradeSlice.reducer;
