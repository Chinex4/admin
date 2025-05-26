// src/slices/activateCopySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	copies: [],
};

const activateCopySlice = createSlice({
	name: 'activateCopy',
	initialState,
	reducers: {
		setCopies: (state, action) => {
			state.copies = action.payload;
		},
		deleteCopy: (state, action) => {
			state.copies = state.copies.filter((c) => c.id !== action.payload);
		},
		approveCopy: (state, action) => {
			const copy = state.copies.find((c) => c.id === action.payload);
			if (copy) copy.status = 'Approved';
		},
		disapproveCopy: (state, action) => {
			const copy = state.copies.find((c) => c.id === action.payload);
			if (copy) copy.status = 'Disapproved';
		},
	},
});

export const { setCopies, deleteCopy, approveCopy, disapproveCopy } =
	activateCopySlice.actions;

export default activateCopySlice.reducer;
