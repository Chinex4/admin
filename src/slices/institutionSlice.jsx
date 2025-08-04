// src/slices/institutionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import { showPromise } from '../utils/toast';
const createdAt = new Date().toLocaleString('en-US', {
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});

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
    const payload = { createdAt };

    return await showPromise(
      axiosInstance.patch(`/admin/approveInstitution/${id}`, payload),
      {
        loading: 'Approving...',
        success: 'Institution approved',
        error: 'Failed to approve',
      },
    ).then(() => ({ id, createdAt }));
  },
);

export const rejectInstitution = createAsyncThunk(
  'institution/reject',
  async (id) => {
    const payload = { createdAt };

    return await showPromise(
      axiosInstance.patch(`/admin/rejectInstitution/${id}`, payload),
      {
        loading: 'Rejecting...',
        success: 'Institution rejected',
        error: 'Failed to reject',
      },
    ).then(() => ({ id, createdAt }));
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
export const updateInstitution = createAsyncThunk(
  'institution/update',
  async ({ id, updates }) => {
    const payload = { ...updates, createdAt };
    const res = await showPromise(
      axiosInstance.put(`/admin/updateInstitution/${id}`, payload),
      {
        loading: 'Updating...',
        success: 'Institution updated',
        error: 'Update failed',
      },
    );
    return res.data.updatedInstitution;
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
        const { id, createdAt } = action.payload;
        const match = state.list.find((item) => item.id === id);
        if (match) match.status = 'Approved';
      })
      .addCase(rejectInstitution.fulfilled, (state, action) => {
        const { id, createdAt } = action.payload;
        const match = state.list.find((item) => item.id === id);
        if (match) match.status = 'Rejected';
      });
  },
});

export const { setInstitutionList } = institutionSlice.actions;
export default institutionSlice.reducer;
