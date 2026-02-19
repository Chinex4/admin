import { createSlice } from '@reduxjs/toolkit';
import {
  approveReferral,
  disapproveReferral,
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

const toComparableId = (value) =>
  value === null || value === undefined ? '' : String(value).trim();

const matchesReferral = (item, id) => {
  const target = toComparableId(id);
  if (!target) return false;
  return (
    toComparableId(item?.id) === target ||
    toComparableId(item?.referralId) === target ||
    toComparableId(item?.referral_id) === target
  );
};

const normalizeIncomingRecord = (response) => {
  if (!response || typeof response !== 'object') return {};
  if (response.record && typeof response.record === 'object') {
    return response.record;
  }
  return response;
};

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
        const incoming = normalizeIncomingRecord(response);
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
      .addCase(approveReferral.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(approveReferral.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { id, response, amount, status } = action.payload;
        const index = state.list.findIndex((item) => matchesReferral(item, id));
        if (index === -1) return;
        const incoming = normalizeIncomingRecord(response);
        const hasAmount = Number.isFinite(Number(amount)) && Number(amount) > 0;
        state.list[index] = {
          ...state.list[index],
          ...incoming,
          ...(hasAmount ? { amtEarned: amount } : {}),
          status: incoming?.status || status || 'approved',
        };
      })
      .addCase(approveReferral.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || 'Failed to approve referral';
      })
      .addCase(disapproveReferral.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(disapproveReferral.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { id, response, status } = action.payload;
        const index = state.list.findIndex((item) => matchesReferral(item, id));
        if (index === -1) return;
        const incoming = normalizeIncomingRecord(response);
        state.list[index] = {
          ...state.list[index],
          ...incoming,
          status: incoming?.status || status || 'disapproved',
        };
      })
      .addCase(disapproveReferral.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || 'Failed to disapprove referral';
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
