// src/slices/copiedTraderSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	copiedTraders: [],
};

const copiedTraderSlice = createSlice({
	name: 'copiedTraders',
	initialState,
	reducers: {
		setCopiedTraders: (state, action) => {
			state.copiedTraders = action.payload;
		},
		deleteCopiedTrader: (state, action) => {
			state.copiedTraders = state.copiedTraders.filter(
				(t) => t.id !== action.payload
			);
		},
		approveCopiedTrader: (state, action) => {
			const trader = state.copiedTraders.find((t) => t.id === action.payload);
			if (trader) trader.copyStatus = 'Approved';
		},
		disapproveCopiedTrader: (state, action) => {
			const trader = state.copiedTraders.find((t) => t.id === action.payload);
			if (trader) trader.copyStatus = 'Disapproved';
		},
	},
});

export const {
	setCopiedTraders,
	deleteCopiedTrader,
	approveCopiedTrader,
	disapproveCopiedTrader,
} = copiedTraderSlice.actions;

export default copiedTraderSlice.reducer;
