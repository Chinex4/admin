// src/slices/institutionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import { showPromise } from '../utils/toast';

export const fetchInstitutionalVerifications = createAsyncThunk(
  'institution/fetchAll',
  async () => {
    const res = await axiosInstance.get('/admin/getInstitutionalVerifications');
    return res.data.message;
  },
);

export const approveInstitution = createAsyncThunk(
  'institution/approve',
  async (id) => {
    return await showPromise(
      axiosInstance.post(`/admin/approveInstitution/${id}`),
      {
        loading: 'Approving...',
        success: 'Institution approved',
        error: 'Failed to approve',
      },
    ).then(() => id);
  },
);

export const rejectInstitution = createAsyncThunk(
  'institution/reject',
  async (id) => {
    return await showPromise(
      axiosInstance.post(`/admin/rejectInstitution/${id}`),
      {
        loading: 'Rejecting...',
        success: 'Institution rejected',
        error: 'Failed to reject',
      },
    ).then(() => id);
  },
);

export const deleteInstitution = createAsyncThunk(
  'institution/delete',
  async (id) => {
    return await showPromise(
      axiosInstance.delete(`/admin/deleteInstitution/${id}`),
      {
        loading: 'Deleting...',
        success: 'Institution deleted',
        error: 'Failed to delete',
      },
    ).then(() => id);
  },
);

const institutionSlice = createSlice({
  name: 'institution',
  initialState: {
    list: [],
  },
  reducers: {
    setInstitutionList: (state, action) => {
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstitutionalVerifications.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(deleteInstitution.fulfilled, (state, action) => {
        state.list = state.list.filter((item) => item.id !== action.payload);
      })
      .addCase(approveInstitution.fulfilled, (state, action) => {
        const match = state.list.find((item) => item.id === action.payload);
        if (match) match.status = 'Approved';
      })
      .addCase(rejectInstitution.fulfilled, (state, action) => {
        const match = state.list.find((item) => item.id === action.payload);
        if (match) match.status = 'Rejected';
      });
  },
});

export const { setInstitutionList } = institutionSlice.actions;
export default institutionSlice.reducer;
