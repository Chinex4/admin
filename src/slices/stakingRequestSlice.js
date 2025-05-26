// src/slices/stakingRequestSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	stakingRequests: [],
};

const stakingRequestSlice = createSlice({
	name: 'stakingRequests',
	initialState,
	reducers: {
		setStakingRequests: (state, action) => {
			state.stakingRequests = action.payload;
		},
		deleteStakingRequest: (state, action) => {
			state.stakingRequests = state.stakingRequests.filter(
				(r) => r.id !== action.payload
			);
		},
		approveStakingRequest: (state, action) => {
			const req = state.stakingRequests.find((r) => r.id === action.payload);
			if (req) req.status = 'Approved';
		},
		disapproveStakingRequest: (state, action) => {
			const req = state.stakingRequests.find((r) => r.id === action.payload);
			if (req) req.status = 'Disapproved';
		},
	},
});

export const {
	setStakingRequests,
	deleteStakingRequest,
	approveStakingRequest,
	disapproveStakingRequest,
} = stakingRequestSlice.actions;

export default stakingRequestSlice.reducer;
