// src/slices/kycSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import { showPromise } from '../utils/toast';

// ========== THUNKS ==========
// BASIC
export const fetchBasicKycs = createAsyncThunk('kyc/fetchBasic', async () => {
  const res = await axiosInstance.get('/admin/getBasicKycs');
  return res.data.message;
});

// ADVANCED
export const fetchAdvancedKycs = createAsyncThunk(
  'kyc/fetchAdvanced',
  async () => {
    const res = await axiosInstance.get('/admin/getAdvancedKycs');
    return res.data.message;
  },
);

// SHARED
export const deleteKycAsync = createAsyncThunk('kyc/delete', async (id) => {
  return await showPromise(axiosInstance.delete(`/admin/deleteKyc/${id}`), {
    loading: 'Deleting...',
    success: 'KYC deleted',
    error: 'Failed to delete',
  }).then(() => id);
});

export const approveKycAsync = createAsyncThunk('kyc/approve', async (id) => {
  return await showPromise(axiosInstance.post(`/admin/approveKyc/${id}`), {
    loading: 'Approving...',
    success: 'KYC approved',
    error: 'Failed to approve',
  }).then(() => ({
    id,
    status: 'Approved',
    approveDate: new Date().toLocaleString(),
  }));
});

export const disapproveKycAsync = createAsyncThunk(
  'kyc/disapprove',
  async (id) => {
    return await showPromise(axiosInstance.post(`/admin/disapproveKyc/${id}`), {
      loading: 'Disapproving...',
      success: 'KYC disapproved',
      error: 'Failed to disapprove',
    }).then(() => ({ id, status: 'Disapproved' }));
  },
);

// ========== SLICE ==========

const kycSlice = createSlice({
  name: 'kyc',
  initialState: {
    basicKycs: [],
    advancedKycs: [],
  },
  reducers: {
    setKycs: (state, action) => {
      state.basicKycs = action.payload;
    },
    setAdvancedKycs: (state, action) => {
      state.advancedKycs = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // BASIC
      .addCase(fetchBasicKycs.fulfilled, (state, action) => {
        state.basicKycs = action.payload;
      })
      // ADVANCED
      .addCase(fetchAdvancedKycs.fulfilled, (state, action) => {
        state.advancedKycs = action.payload;
      })
      // SHARED
      .addCase(deleteKycAsync.fulfilled, (state, action) => {
        state.basicKycs = state.basicKycs.filter(
          (k) => k.id !== action.payload,
        );
        state.advancedKycs = state.advancedKycs.filter(
          (k) => k.id !== action.payload,
        );
      })
      .addCase(approveKycAsync.fulfilled, (state, action) => {
        const { id, status, approveDate } = action.payload;
        const matchBasic = state.basicKycs.find((k) => k.id === id);
        const matchAdv = state.advancedKycs.find((k) => k.id === id);
        if (matchBasic) {
          matchBasic.status = status;
          matchBasic.approveDate = approveDate;
        }
        if (matchAdv) {
          matchAdv.status = status;
          matchAdv.approveDate = approveDate;
        }
      })
      .addCase(disapproveKycAsync.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const matchBasic = state.basicKycs.find((k) => k.id === id);
        const matchAdv = state.advancedKycs.find((k) => k.id === id);
        if (matchBasic) {
          matchBasic.status = status;
          matchBasic.approveDate = null;
        }
        if (matchAdv) {
          matchAdv.status = status;
          matchAdv.approveDate = null;
        }
      });
  },
});

export const { setKycs, setAdvancedKycs } = kycSlice.actions;
export default kycSlice.reducer;
