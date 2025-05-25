// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../slices/userSlice';

const store = configureStore({
	reducer: {
		users: usersReducer,
	},
});

export default store;
