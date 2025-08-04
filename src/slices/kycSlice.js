import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import { showPromise } from '../utils/toast';

export const fetchKycs = createAsyncThunk('kycs/fetchKycs', async () => {
  const res = await axiosInstance.get('/user/getKycList');
  return res.data.kycs;
});

export const deleteKycAsync = createAsyncThunk('kycs/deleteKyc', async (id) => {
  return await showPromise(axiosInstance.delete(`/user/deleteKyc/${id}`), {
    loading: 'Deleting KYC...',
    success: 'KYC deleted',
    error: 'Failed to delete KYC',
  }).then(() => id);
});

export const approveKycAsync = createAsyncThunk(
  'kycs/approveKyc',
  async (id) => {
    return await showPromise(axiosInstance.post(`/user/approveKyc/${id}`), {
      loading: 'Approving KYC...',
      success: 'KYC approved',
      error: 'Failed to approve KYC',
    }).then(() => ({
      id,
      status: 'Approved',
      approveDate: new Date().toLocaleString(),
    }));
  },
);

export const disapproveKycAsync = createAsyncThunk(
  'kycs/disapproveKyc',
  async (id) => {
    return await showPromise(axiosInstance.post(`/user/disapproveKyc/${id}`), {
      loading: 'Disapproving KYC...',
      success: 'KYC disapproved',
      error: 'Failed to disapprove KYC',
    }).then(() => ({ id, status: 'Disapproved' }));
  },
);

const kycSlice = createSlice({
  name: 'kycs',
  initialState: { kycs: [] },
  reducers: {
    setKycs: (state, action) => {
      state.kycs = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKycs.fulfilled, (state, action) => {
        state.kycs = action.payload;
      })
      .addCase(deleteKycAsync.fulfilled, (state, action) => {
        state.kycs = state.kycs.filter((k) => k.id !== action.payload);
      })
      .addCase(approveKycAsync.fulfilled, (state, action) => {
        const kyc = state.kycs.find((k) => k.id === action.payload.id);
        if (kyc) {
          kyc.status = action.payload.status;
          kyc.approveDate = action.payload.approveDate;
        }
      })
      .addCase(disapproveKycAsync.fulfilled, (state, action) => {
        const kyc = state.kycs.find((k) => k.id === action.payload.id);
        if (kyc) {
          kyc.status = action.payload.status;
          kyc.approveDate = null;
        }
      });
  },
});

export const { setKycs } = kycSlice.actions;
export default kycSlice.reducer;
