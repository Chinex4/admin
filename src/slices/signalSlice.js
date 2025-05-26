// src/slices/signalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	signals: [],
};

const signalSlice = createSlice({
	name: 'signals',
	initialState,
	reducers: {
		setSignals: (state, action) => {
			state.signals = action.payload;
		},
		deleteSignal: (state, action) => {
			state.signals = state.signals.filter((s) => s.id !== action.payload);
		},
		approveSignal: (state, action) => {
			const signal = state.signals.find((s) => s.id === action.payload);
			if (signal) signal.status = 'Approved';
		},
		disapproveSignal: (state, action) => {
			const signal = state.signals.find((s) => s.id === action.payload);
			if (signal) signal.status = 'Disapproved';
		},
	},
});

export const { setSignals, deleteSignal, approveSignal, disapproveSignal } =
	signalSlice.actions;

export default signalSlice.reducer;
