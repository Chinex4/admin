// src/slices/copiedTraderSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
	editCopyTradeOrder,
	deleteCopyTradeOrder,
	approveCopyTradeOrder,
	disapproveCopyTradeOrder,
} from '../redux/thunks/copyTradeOrdersThunk';

const initialState = {
	copiedTraders: [],
	actionLoading: false,
	actionError: null,
};

const matchesOrder = (order, orderId) =>
	String(order?.id) === String(orderId) ||
	String(order?.copyRequestId) === String(orderId);

const copiedTraderSlice = createSlice({
	name: 'copiedTraders',
	initialState,
	reducers: {
		setCopiedTraders: (state, action) => {
			state.copiedTraders = action.payload;
		},
		deleteCopiedTrader: (state, action) => {
			state.copiedTraders = state.copiedTraders.filter(
				(t) => t.id !== action.payload
			);
		},
		approveCopiedTrader: (state, action) => {
			const trader = state.copiedTraders.find((t) => t.id === action.payload);
			if (trader) trader.copyStatus = 'Approved';
		},
		disapproveCopiedTrader: (state, action) => {
			const trader = state.copiedTraders.find((t) => t.id === action.payload);
			if (trader) trader.copyStatus = 'Disapproved';
		},
		clearCopiedTraderActionError: (state) => {
			state.actionError = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(editCopyTradeOrder.pending, (state) => {
				state.actionLoading = true;
				state.actionError = null;
			})
			.addCase(editCopyTradeOrder.fulfilled, (state, action) => {
				state.actionLoading = false;
				const { orderId, payload, response } = action.payload;
				const index = state.copiedTraders.findIndex((order) =>
					matchesOrder(order, orderId)
				);
				if (index === -1) return;
				const incoming = response && typeof response === 'object' ? response : {};
				state.copiedTraders[index] = {
					...state.copiedTraders[index],
					...payload,
					...incoming,
				};
			})
			.addCase(editCopyTradeOrder.rejected, (state, action) => {
				state.actionLoading = false;
				state.actionError = action.payload || 'Failed to edit copy trade order';
			})
			.addCase(deleteCopyTradeOrder.pending, (state) => {
				state.actionLoading = true;
				state.actionError = null;
			})
			.addCase(deleteCopyTradeOrder.fulfilled, (state, action) => {
				state.actionLoading = false;
				const id = action.payload;
				state.copiedTraders = state.copiedTraders.filter(
					(order) => !matchesOrder(order, id)
				);
			})
			.addCase(deleteCopyTradeOrder.rejected, (state, action) => {
				state.actionLoading = false;
				state.actionError = action.payload || 'Failed to delete copy trade order';
			})
			.addCase(approveCopyTradeOrder.pending, (state) => {
				state.actionLoading = true;
				state.actionError = null;
			})
			.addCase(approveCopyTradeOrder.fulfilled, (state, action) => {
				state.actionLoading = false;
				const { orderId, response, status } = action.payload;
				const index = state.copiedTraders.findIndex((order) =>
					matchesOrder(order, orderId)
				);
				if (index === -1) return;
				const incoming = response && typeof response === 'object' ? response : {};
				state.copiedTraders[index] = {
					...state.copiedTraders[index],
					status,
					...incoming,
				};
			})
			.addCase(approveCopyTradeOrder.rejected, (state, action) => {
				state.actionLoading = false;
				state.actionError = action.payload || 'Failed to approve copy trade order';
			})
			.addCase(disapproveCopyTradeOrder.pending, (state) => {
				state.actionLoading = true;
				state.actionError = null;
			})
			.addCase(disapproveCopyTradeOrder.fulfilled, (state, action) => {
				state.actionLoading = false;
				const { orderId, response, status } = action.payload;
				const index = state.copiedTraders.findIndex((order) =>
					matchesOrder(order, orderId)
				);
				if (index === -1) return;
				const incoming = response && typeof response === 'object' ? response : {};
				state.copiedTraders[index] = {
					...state.copiedTraders[index],
					status,
					...incoming,
				};
			})
			.addCase(disapproveCopyTradeOrder.rejected, (state, action) => {
				state.actionLoading = false;
				state.actionError =
					action.payload || 'Failed to disapprove copy trade order';
			});
	},
});

export const {
	setCopiedTraders,
	deleteCopiedTrader,
	approveCopiedTrader,
	disapproveCopiedTrader,
	clearCopiedTraderActionError,
} = copiedTraderSlice.actions;

export default copiedTraderSlice.reducer;
