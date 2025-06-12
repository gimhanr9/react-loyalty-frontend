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
  cursor: string | null;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: LoyaltyState = {
  balance: 0,
  transactions: [],
  cursor: null,
  hasMore: false,
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
    fetchHistoryRequest: (
      state,
      action: PayloadAction<{ cursor?: string; reset?: boolean } | undefined>
    ) => {
      state.loading = true;
      state.error = null;
      // If reset is true, we're starting fresh (e.g., new search/filter)
      if (action.payload?.reset) {
        state.transactions = [];
        state.cursor = null;
        state.hasMore = false;
      }
    },
    fetchHistorySuccess: (
      state,
      action: PayloadAction<{
        transactions: Transaction[];
        cursor: string | null;
        hasMore: boolean;
      }>
    ) => {
      const { transactions, cursor, hasMore } = action.payload;
      // If we have a cursor in the request, append transactions; otherwise replace
      if (state.cursor && !action.payload.cursor) {
        state.transactions = [...state.transactions, ...transactions];
      } else {
        state.transactions = transactions;
      }
      state.cursor = cursor;
      state.hasMore = hasMore;
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
