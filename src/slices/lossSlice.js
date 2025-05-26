// src/slices/lossSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	losses: [],
};

const lossSlice = createSlice({
	name: 'losses',
	initialState,
	reducers: {
		setLosses: (state, action) => {
			state.losses = action.payload;
		},
		deleteLoss: (state, action) => {
			state.losses = state.losses.filter((l) => l.id !== action.payload);
		},
	},
});

export const { setLosses, deleteLoss } = lossSlice.actions;
export default lossSlice.reducer;
