// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../slices/userSlice';
import depositReducer from '../slices/depositSlice';
import withdrawReducer from '../slices/withdrawSlice';
import profitReducer from '../slices/profitSlice';
import lossReducer from '../slices/lossSlice';
import tradeReducer from '../slices/tradeSlice';
import proofReducer from '../slices/proofSlice';
import walletReducer from '../slices/walletSlice';
import kycReducer from '../slices/kycSlice';
import copyTraderReducer from '../slices/copyTraderSlice';
import copiedTraderReducer from '../slices/copiedTraderSlice';
import signalReducer from '../slices/signalSlice';
import activateCopyReducer from '../slices/activateCopySlice';
import stakingReducer from '../slices/stakingSlice';
import stakingRequestReducer from '../slices/stakingRequestSlice';
import authReducer from '../slices/authSlice';
import dataReducer from '../slices/fetchSlice';
const store = configureStore({
  reducer: {
	auth: authReducer,
    users: usersReducer,
    deposits: depositReducer,
    withdrawals: withdrawReducer,
    profits: profitReducer,
    losses: lossReducer, 
	trades: tradeReducer,
	wallets: walletReducer,
	proofs: proofReducer,
	kyc: kycReducer,
	copyTraders: copyTraderReducer,
	copiedTraders: copiedTraderReducer,
	signals: signalReducer,
	activateCopy: activateCopyReducer,
	staking: stakingReducer,
	stakingRequests: stakingRequestReducer,
	data: dataReducer,
  },
});


export default store;
