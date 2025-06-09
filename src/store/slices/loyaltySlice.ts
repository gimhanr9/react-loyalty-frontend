import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Transaction {
  id: string;
  type: "earn" | "redeem";
  points: number;
  description: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

interface LoyaltyState {
  balance: number;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: LoyaltyState = {
  balance: 0,
  transactions: [],
  loading: false,
  error: null,
};

const loyaltySlice = createSlice({
  name: "loyalty",
  initialState,
  reducers: {
    fetchBalanceRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBalanceSuccess: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
      state.loading = false;
    },
    fetchBalanceFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchHistoryRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchHistorySuccess: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
      state.loading = false;
    },
    fetchHistoryFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    earnPointsRequest: (
      state,
      action: PayloadAction<{ amount: number; description: string }>
    ) => {
      state.loading = true;
      state.error = null;
    },
    earnPointsSuccess: (
      state,
      action: PayloadAction<{ points: number; transaction: Transaction }>
    ) => {
      state.balance += action.payload.points;
      state.transactions.unshift(action.payload.transaction);
      state.loading = false;
    },
    earnPointsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    redeemPointsRequest: (
      state,
      action: PayloadAction<{ points: number; description: string }>
    ) => {
      state.loading = true;
      state.error = null;
    },
    redeemPointsSuccess: (
      state,
      action: PayloadAction<{ points: number; transaction: Transaction }>
    ) => {
      state.balance -= action.payload.points;
      state.transactions.unshift(action.payload.transaction);
      state.loading = false;
    },
    redeemPointsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchBalanceRequest,
  fetchBalanceSuccess,
  fetchBalanceFailure,
  fetchHistoryRequest,
  fetchHistorySuccess,
  fetchHistoryFailure,
  earnPointsRequest,
  earnPointsSuccess,
  earnPointsFailure,
  redeemPointsRequest,
  redeemPointsSuccess,
  redeemPointsFailure,
  clearError,
} = loyaltySlice.actions;

export default loyaltySlice.reducer;
