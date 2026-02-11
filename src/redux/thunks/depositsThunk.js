import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const fetchAdminDeposits = createAsyncThunk(
  'admin/fetchDeposits',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('admin/deposits');
      return res?.data?.message ?? res?.data ?? res;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || 'Failed to fetch deposits'
      );
    }
  }
);

export const approveDeposit = createAsyncThunk(
  'admin/approveDeposit',
  async ({ depositId, actionDate }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `admin/approveDeposit/${depositId}`,
        { actionDate }
      );
      return res;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || 'Failed to approve deposit'
      );
    }
  }
);

export const disapproveDeposit = createAsyncThunk(
  'admin/disapproveDeposit',
  async ({ depositId, actionDate }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `admin/disapproveDeposit/${depositId}`,
        { actionDate }
      );
      return res;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || 'Failed to disapprove deposit'
      );
    }
  }
);

export const deleteAdminDeposit = createAsyncThunk(
  'admin/deleteDeposit',
  async (depositId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`admin/deleteDeposit/${depositId}`);
      return res;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || 'Failed to delete deposit'
      );
    }
  }
);

export const updateAdminDeposit = createAsyncThunk(
  'admin/updateDeposit',
  async ({ depositId, payload }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `admin/updateDeposit/${depositId}`,
        payload
      );
      return res;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || 'Failed to update deposit'
      );
    }
  }
);
