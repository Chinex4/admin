// src/slices/proofSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	proofs: [],
	selectedImage: null,
};

const proofSlice = createSlice({
	name: 'proofs',
	initialState,
	reducers: {
		setProofs: (state, action) => {
			state.proofs = action.payload;
		},
		deleteProof: (state, action) => {
			state.proofs = state.proofs.filter((p) => p.id !== action.payload);
		},
		setSelectedImage: (state, action) => {
			state.selectedImage = action.payload;
		},
		clearSelectedImage: (state) => {
			state.selectedImage = null;
		},
	},
});

export const { setProofs, deleteProof, setSelectedImage, clearSelectedImage } =
	proofSlice.actions;
export default proofSlice.reducer;
