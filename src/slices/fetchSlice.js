import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance'; 

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk(
  'data/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('admin/fetchAlluser'); 
      return response.data.message.userDetails;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

// Initial state
const initialState = {
  fetchedUsers: [],
  loading: false,
  error: null,

  // Add more states here for other fetches (e.g., admins, trades)
};

// Slice
const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    // Optional: clear errors, reset state, etc.
  },
  extraReducers: (builder) => {
    // USERS
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.fetchedUsers = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add more fetch cases here...
  },
});

export default dataSlice.reducer;
