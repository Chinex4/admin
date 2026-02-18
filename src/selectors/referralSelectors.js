export const selectReferralsState = (state) => state.referrals;

export const selectReferrals = (state) =>
  selectReferralsState(state)?.list || [];

export const selectReferralsLoading = (state) =>
  Boolean(selectReferralsState(state)?.loading);

export const selectReferralsError = (state) =>
  selectReferralsState(state)?.error || null;

export const selectReferralActionLoading = (state) =>
  Boolean(selectReferralsState(state)?.actionLoading);

export const selectReferralActionError = (state) =>
  selectReferralsState(state)?.actionError || null;
