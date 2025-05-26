// src/slices/copyTraderSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	traders: [],
};

const copyTraderSlice = createSlice({
	name: 'copyTraders',
	initialState,
	reducers: {
		setTraders: (state, action) => {
			state.traders = action.payload;
		},
		deleteTrader: (state, action) => {
			state.traders = state.traders.filter((t) => t.id !== action.payload);
		},
	},
});

export const { setTraders, deleteTrader } = copyTraderSlice.actions;
export default copyTraderSlice.reducer;
