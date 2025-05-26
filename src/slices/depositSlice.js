// src/slices/depositSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	deposits: [],
	selectedDeposit: null,
	depositModalType: null,
};

const depositSlice = createSlice({
	name: 'deposits',
	initialState,
	reducers: {
		setDeposits: (state, action) => {
			state.deposits = action.payload;
		},
		setSelectedDeposit: (state, action) => {
			state.selectedDeposit = action.payload;
		},
		setDepositModalType: (state, action) => {
			state.depositModalType = action.payload;
		},
		clearDepositModal: (state) => {
			state.selectedDeposit = null;
			state.depositModalType = null;
		},
		updateDeposit: (state, action) => {
			const idx = state.deposits.findIndex((d) => d.id === action.payload.id);
			if (idx !== -1) state.deposits[idx] = action.payload;
		},
		deleteDeposit: (state, action) => {
			state.deposits = state.deposits.filter((d) => d.id !== action.payload);
		},
	},
});

export const {
	setDeposits,
	setSelectedDeposit,
	setDepositModalType,
	clearDepositModal,
	updateDeposit,
	deleteDeposit,
} = depositSlice.actions;

export default depositSlice.reducer;
