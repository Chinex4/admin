import { createSlice } from '@reduxjs/toolkit';
import {
  deleteReferral,
  fetchReferrals,
  updateReferral,
} from '../redux/thunks/referralThunk';

const initialState = {
  list: [],
  loading: false,
  error: null,
  actionLoading: false,
  actionError: null,
};

const matchesReferral = (item, id) =>
  String(item?.id) === String(id) || String(item?.referralId) === String(id);

const referralSlice = createSlice({
  name: 'referrals',
  initialState,
  reducers: {
    clearReferralActionError: (state) => {
      state.actionError = null;
    },
    clearReferralError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferrals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferrals.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchReferrals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch referral records';
      })
      .addCase(updateReferral.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateReferral.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { id, payload, response } = action.payload;
        const index = state.list.findIndex((item) => matchesReferral(item, id));
        if (index === -1) return;
        const incoming = response && typeof response === 'object' ? response : {};
        state.list[index] = {
          ...state.list[index],
          ...payload,
          ...incoming,
        };
      })
      .addCase(updateReferral.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || 'Failed to update referral record';
      })
      .addCase(deleteReferral.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteReferral.fulfilled, (state, action) => {
        state.actionLoading = false;
        const id = action.payload;
        state.list = state.list.filter((item) => !matchesReferral(item, id));
      })
      .addCase(deleteReferral.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || 'Failed to delete referral record';
      });
  },
});

export const { clearReferralActionError, clearReferralError } =
  referralSlice.actions;
export default referralSlice.reducer;
