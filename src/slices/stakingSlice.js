// src/slices/stakingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	stakings: [],
	selectedStaking: null,
	stakingModalType: null, // 'add' | 'edit'
};

const stakingSlice = createSlice({
	name: 'staking',
	initialState,
	reducers: {
		setStakings: (state, action) => {
			state.stakings = action.payload;
		},
		deleteStaking: (state, action) => {
			state.stakings = state.stakings.filter((s) => s.id !== action.payload);
		},
		addStaking: (state, action) => {
			state.stakings.push(action.payload);
		},
		updateStaking: (state, action) => {
			const index = state.stakings.findIndex((s) => s.id === action.payload.id);
			if (index !== -1) state.stakings[index] = action.payload;
		},
		setSelectedStaking: (state, action) => {
			state.selectedStaking = action.payload;
		},
		setStakingModalType: (state, action) => {
			state.stakingModalType = action.payload;
		},
		clearStakingModal: (state) => {
			state.selectedStaking = null;
			state.stakingModalType = null;
		},
	},
});

export const {
	setStakings,
	deleteStaking,
	addStaking,
	updateStaking,
	setSelectedStaking,
	setStakingModalType,
	clearStakingModal,
} = stakingSlice.actions;

export default stakingSlice.reducer;
