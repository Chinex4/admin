// src/slices/tradeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  trades: [],
  selectedTrade: null,
  tradeModalType: null,
};

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
    updateTradeOutcome: (state, action) => {
      const { id, outcome } = action.payload;
      const index = state.trades.findIndex(t => t.id === id);
      if (index !== -1) state.trades[index].outcome = outcome;
    },
    deleteTrade: (state, action) => {
      state.trades = state.trades.filter(t => t.id !== action.payload);
    },
  },
});

export const {
  setTrades,
  setSelectedTrade,
  setTradeModalType,
  clearTradeModal,
  updateTradeOutcome,
  deleteTrade,
} = tradeSlice.actions;

export default tradeSlice.reducer;
