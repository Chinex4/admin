// src/slices/walletSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	wallets: [],
};

const walletSlice = createSlice({
	name: 'wallets',
	initialState,
	reducers: {
		setWallets: (state, action) => {
			state.wallets = action.payload;
		},
		deleteWallet: (state, action) => {
			state.wallets = state.wallets.filter((w) => w.id !== action.payload);
		},
	},
});

export const { setWallets, deleteWallet } = walletSlice.actions;
export default walletSlice.reducer;
