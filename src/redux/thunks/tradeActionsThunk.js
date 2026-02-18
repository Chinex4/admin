import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const editTradeOrder = createAsyncThunk(
  'trades/editTradeOrder',
  async ({ tradeId, payload }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`admin/tradeOrders/${tradeId}`, payload);
      const data = res?.data?.message ?? res?.data ?? {};
      return { tradeId: String(tradeId), payload, response: data };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to edit trade details'));
    }
  }
);

export const winTradeOrder = createAsyncThunk(
  'trades/winTradeOrder',
  async ({ tradeId, userId, amount }, { rejectWithValue }) => {
    try {
      const tradeKey = String(tradeId ?? '').trim();
      const amountText = String(amount ?? '').trim();
      const userKey = userId === null || userId === undefined ? '' : String(userId).trim();
      const actionDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const payload = {
        amount: amountText,
        Amountn: amountText,
        actionAmount: amountText,
        winAmount: amountText,
        actionDate,
        tradeproId: tradeKey,
      };

      if (userKey) {
        payload.userId = userKey;
        payload.userproId = userKey;
      }

      const res = await axiosInstance.patch(`admin/winTrade/${tradeKey}`, payload);
      const data = res?.data?.message ?? res?.data ?? {};
      return { tradeId: tradeKey, amount: amountText, response: data };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to mark trade as win'));
    }
  }
);

export const lossTradeOrder = createAsyncThunk(
  'trades/lossTradeOrder',
  async ({ tradeId, amount }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`admin/lossTrade/${tradeId}`, {
        amount,
        actionDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
      });
      const data = res?.data?.message ?? res?.data ?? {};
      return { tradeId: String(tradeId), amount: String(amount), response: data };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to mark trade as loss'));
    }
  }
);

export const deleteTradeOrder = createAsyncThunk(
  'trades/deleteTradeOrder',
  async (tradeId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`admin/tradeOrders/${tradeId}`);
      return String(tradeId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete trade'));
    }
  }
);
