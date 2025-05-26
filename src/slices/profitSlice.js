// src/slices/profitSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profits: [],
};

const profitSlice = createSlice({
  name: 'profits',
  initialState,
  reducers: {
    setProfits: (state, action) => {
      state.profits = action.payload;
    },
    deleteProfit: (state, action) => {
      state.profits = state.profits.filter((p) => p.id !== action.payload);
    },
  },
});

export const { setProfits, deleteProfit } = profitSlice.actions;
export default profitSlice.reducer;
