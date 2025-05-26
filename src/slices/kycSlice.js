// src/slices/kycSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	kycs: [],
};

const kycSlice = createSlice({
	name: 'kycs',
	initialState,
	reducers: {
		setKycs: (state, action) => {
			state.kycs = action.payload;
		},
		deleteKyc: (state, action) => {
			state.kycs = state.kycs.filter((k) => k.id !== action.payload);
		},
		approveKyc: (state, action) => {
			const kyc = state.kycs.find((k) => k.id === action.payload);
			if (kyc) {
				kyc.status = 'Approved';
				kyc.approveDate = new Date().toLocaleString();
			}
		},
		disapproveKyc: (state, action) => {
			const kyc = state.kycs.find((k) => k.id === action.payload);
			if (kyc) {
				kyc.status = 'Disapproved';
				kyc.approveDate = null;
			}
		},
	},
});

export const { setKycs, deleteKyc, approveKyc, disapproveKyc } =
	kycSlice.actions;
export default kycSlice.reducer;
