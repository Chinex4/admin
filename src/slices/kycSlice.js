// src/slices/kycSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import { showPromise } from '../utils/toast';

const createdAt = new Date().toLocaleString('en-US', {
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});

// ========== BASIC KYC THUNKS ==========

export const fetchBasicKycs = createAsyncThunk('kyc/fetchBasic', async () => {
  const res = await axiosInstance.get('/admin/getBasicKycs');
  return res.data.message;
});

export const approveKycAsync = createAsyncThunk('kyc/approve', async (id) => {
  const payload = { createdAt };
  return await showPromise(
    axiosInstance.patch(`/admin/approveKyc/${id}`, payload),
    {
      loading: 'Approving...',
      success: 'KYC approved',
      error: 'Failed to approve',
    },
  ).then(() => ({
    id,
    status: 'Verified',
    reviewedAt: createdAt,
  }));
});

export const disapproveKycAsync = createAsyncThunk(
  'kyc/disapprove',
  async (id) => {
    const payload = { createdAt };
    return await showPromise(
      axiosInstance.patch(`/admin/disapproveKyc/${id}`, payload),
      {
        loading: 'Disapproving...',
        success: 'KYC disapproved',
        error: 'Failed to disapprove',
      },
    ).then(() => ({
      id,
      status: 'Rejected',
      reviewedAt: createdAt,
    }));
  },
);

export const updateKycAsync = createAsyncThunk(
  'kyc/update',
  async ({ id, formData }) => {
    const res = await showPromise(
      axiosInstance.put(`/admin/updateKyc/${id}`, formData),
      {
        loading: 'Updating...',
        success: 'KYC updated',
        error: 'Failed to update',
      },
    );
    return res.data.message;
  },
);

// ========== ADVANCED KYC THUNKS ==========

export const fetchAdvancedKycs = createAsyncThunk(
  'kyc/fetchAdvanced',
  async () => {
    const res = await axiosInstance.get('/admin/getAdvancedKycs');
    return res.data.message;
  },
);

export const approveAdvancedKycAsync = createAsyncThunk(
  'kyc/approveAdvanced',
  async (id) => {
    const payload = { createdAt };
    return await showPromise(
      axiosInstance.patch(`/admin/approveAdvancedKyc/${id}`, payload),
      {
        loading: 'Approving...',
        success: 'Advanced KYC approved',
        error: 'Approval failed',
      },
    ).then(() => ({
      id,
      status: 'Verified',
      reviewedAt: createdAt,
    }));
  },
);

export const disapproveAdvancedKycAsync = createAsyncThunk(
  'kyc/disapproveAdvanced',
  async (id) => {
    const payload = { createdAt };
    return await showPromise(
      axiosInstance.patch(`/admin/disapproveAdvancedKyc/${id}`, payload),
      {
        loading: 'Disapproving...',
        success: 'Advanced KYC disapproved',
        error: 'Disapproval failed',
      },
    ).then(() => ({
      id,
      status: 'Rejected',
      reviewedAt: createdAt,
    }));
  },
);

export const updateAdvancedKycAsync = createAsyncThunk(
  'kyc/updateAdvanced',
  async ({ id, updates }) => {
    const res = await showPromise(
      axiosInstance.put(`/admin/updateAdvancedKyc/${id}`, updates),
      {
        loading: 'Updating...',
        success: 'Advanced KYC updated',
        error: 'Update failed',
      },
    );
    return res.data.message;
  },
);

export const deleteAdvancedKycAsync = createAsyncThunk(
  'kyc/deleteAdvanced',
  async (id) => {
    return await showPromise(
      axiosInstance.delete(`/admin/deleteAdvancedKyc/${id}`),
      {
        loading: 'Deleting...',
        success: 'Advanced KYC deleted',
        error: 'Failed to delete',
      },
    ).then(() => id);
  },
);

// ========== SHARED (BASIC) DELETE ==========

export const deleteKycAsync = createAsyncThunk('kyc/delete', async (id) => {
  return await showPromise(axiosInstance.delete(`/admin/deleteKyc/${id}`), {
    loading: 'Deleting...',
    success: 'KYC deleted',
    error: 'Failed to delete',
  }).then(() => id);
});

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
      .addCase(updateKycAsync.fulfilled, (state, action) => {
        const updated = action.payload;
        state.basicKycs = state.basicKycs.map((k) =>
          k.id === updated.id ? { ...k, ...updated } : k,
        );
      })
      .addCase(approveKycAsync.fulfilled, (state, action) => {
        const { id, status, reviewedAt } = action.payload;
        const kyc = state.basicKycs.find((k) => k.id === id);
        if (kyc) {
          kyc.status = status;
          kyc.reviewedAt = reviewedAt;
        }
      })
      .addCase(disapproveKycAsync.fulfilled, (state, action) => {
        const { id, status, reviewedAt } = action.payload;
        const kyc = state.basicKycs.find((k) => k.id === id);
        if (kyc) {
          kyc.status = status;
          kyc.reviewedAt = reviewedAt;
        }
      })
      .addCase(deleteKycAsync.fulfilled, (state, action) => {
        state.basicKycs = state.basicKycs.filter(
          (k) => k.id !== action.payload,
        );
      })

      // ADVANCED
      .addCase(fetchAdvancedKycs.fulfilled, (state, action) => {
        state.advancedKycs = action.payload;
      })
      .addCase(updateAdvancedKycAsync.fulfilled, (state, action) => {
        const updated = action.payload;
        state.advancedKycs = state.advancedKycs.map((k) =>
          k.id === updated.id ? { ...k, ...updated } : k,
        );
      })
      .addCase(approveAdvancedKycAsync.fulfilled, (state, action) => {
        const { id, status, reviewedAt } = action.payload;
        const kyc = state.advancedKycs.find((k) => k.id === id);
        if (kyc) {
          kyc.status = status;
          kyc.reviewedAt = reviewedAt;
        }
      })
      .addCase(disapproveAdvancedKycAsync.fulfilled, (state, action) => {
        const { id, status, reviewedAt } = action.payload;
        const kyc = state.advancedKycs.find((k) => k.id === id);
        if (kyc) {
          kyc.status = status;
          kyc.reviewedAt = reviewedAt;
        }
      })
      .addCase(deleteAdvancedKycAsync.fulfilled, (state, action) => {
        state.advancedKycs = state.advancedKycs.filter(
          (k) => k.id !== action.payload,
        );
      });
  },
});

export const { setKycs, setAdvancedKycs } = kycSlice.actions;
export default kycSlice.reducer;
