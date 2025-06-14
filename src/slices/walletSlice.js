import { createSlice } from "@reduxjs/toolkit";
import { updateWallet, deleteWallet } from "../redux/thunks/walletsThunk"; // 👈 import your thunk

const initialState = {
  wallets: [],
  selectedWallet: null,
  walletModalType: null,
};

const walletSlice = createSlice({
  name: "wallets",
  initialState,
  reducers: {
    setWallets: (state, action) => {
      state.wallets = action.payload;
    },
    setSelectedWallet: (state, action) => {
      state.selectedWallet = action.payload;
    },
    setWalletModalType: (state, action) => {
      state.walletModalType = action.payload;
    },
    clearWalletModal: (state) => {
      state.walletModalType = null;
      state.selectedWallet = null;
    },
    // deleteWallet: (state, action) => {
    //   state.wallets = state.wallets.filter(w => w.id !== action.payload);
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(updateWallet.fulfilled, (state, action) => {
      const index = state.wallets.findIndex((w) => w.id === action.payload.id);
      if (index !== -1) {
        state.wallets[index] = action.payload;
      }
    })
    .addCase(deleteWallet.fulfilled, (state, action) => {
      state.wallets = state.wallets.filter(wallet => wallet.id !== action.payload);
    });
  },
});

export const {
  setWallets,
  setSelectedWallet,
  setWalletModalType,
  clearWalletModal,
  // deleteWallet,
} = walletSlice.actions;

export default walletSlice.reducer;
