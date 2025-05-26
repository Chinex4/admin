// src/slices/withdrawSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	withdrawals: [],
	selectedWithdraw: null,
	withdrawModalType: null,
};

const withdrawSlice = createSlice({
	name: 'withdrawals',
	initialState,
	reducers: {
		setWithdrawals: (state, action) => {
			state.withdrawals = action.payload;
		},
		setSelectedWithdraw: (state, action) => {
			state.selectedWithdraw = action.payload;
		},
		setWithdrawModalType: (state, action) => {
			state.withdrawModalType = action.payload;
		},
		clearWithdrawModal: (state) => {
			state.selectedWithdraw = null;
			state.withdrawModalType = null;
		},
		updateWithdraw: (state, action) => {
			const idx = state.withdrawals.findIndex(
				(w) => w.id === action.payload.id
			);
			if (idx !== -1) state.withdrawals[idx] = action.payload;
		},
		deleteWithdraw: (state, action) => {
			state.withdrawals = state.withdrawals.filter(
				(w) => w.id !== action.payload
			);
		},
	},
});

export const {
	setWithdrawals,
	setSelectedWithdraw,
	setWithdrawModalType,
	clearWithdrawModal,
	updateWithdraw,
	deleteWithdraw,
} = withdrawSlice.actions;

export default withdrawSlice.reducer;
