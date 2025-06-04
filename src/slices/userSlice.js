// src/slices/usersSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchUsers } from '../redux/thunks/usersThunk';

const initialState = {
	users: [],
	selectedUser: null,
	modalType: null,  
};

const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		setUsers: (state, action) => {
			state.users = action.payload;
		},
		setSelectedUser: (state, action) => {
			state.selectedUser = action.payload;
		},
		setModalType: (state, action) => {
			state.modalType = action.payload;
		},
		clearModal: (state) => {
			state.modalType = null;
			state.selectedUser = null;
		},
		updateUser: (state, action) => {
			const idx = state.users.findIndex((u) => u.id === action.payload.id);
			if (idx !== -1) state.users[idx] = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUsers.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUsers.fulfilled, (state, action) => {
				state.loading = false;
				state.users = action.payload;
			})
			.addCase(fetchUsers.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'Failed to fetch users';
			});
	},
});

export const {
	setUsers,
	setSelectedUser,
	setModalType,
	clearModal,
	updateUser,
} = usersSlice.actions;

export default usersSlice.reducer;
