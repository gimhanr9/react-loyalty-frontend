import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
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
  fetchRewardTierSuccess,
  fetchRewardTierFailure,
  fetchRewardTierRequest,
} from "../slices/loyaltySlice";
import { addNotification } from "../slices/uiSlice";
import { loyaltyApi } from "../../services/apiClient";

function* fetchBalanceSaga() {
  try {
    const balance: number = yield call(loyaltyApi.getBalance);
    yield put(fetchBalanceSuccess(balance));
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ?? "Failed to fetch balance";
    yield put(fetchBalanceFailure(errorMessage));
  }
}

function* fetchRewardTierSaga() {
  try {
    const response: { balance: number; rewardtier: any } = yield call(
      loyaltyApi.getRewardTier
    );
    yield put(fetchRewardTierSuccess(response));
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ?? "Failed to fetch reward tiers";
    yield put(fetchRewardTierFailure(errorMessage));
  }
}

function* fetchHistorySaga(
  action: PayloadAction<{ cursor?: string; reset?: boolean } | undefined>
) {
  try {
    const params = action.payload || {};
    const response: {
      transactions: any[];
      cursor: string | null;
      hasMore: boolean;
    } = yield call(loyaltyApi.getHistory, params.cursor);
    yield put(
      fetchHistorySuccess({
        transactions: response.transactions,
        cursor: response.cursor,
        hasMore: !!response.cursor && response.cursor !== "",
      })
    );
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ?? "Failed to fetch history";
    yield put(fetchHistoryFailure(errorMessage));
  }
}

function* earnPointsSaga(
  action: PayloadAction<{ amount: number; description: string }>
) {
  try {
    const response: { balance: number; rewardtier: any } = yield call(
      loyaltyApi.earnPoints,
      action.payload
    );
    yield put(earnPointsSuccess(response));
    yield put(
      addNotification({
        message: `Successfully earned points!`,
        type: "success",
      })
    );
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ?? "Failed to earn points";
    yield put(earnPointsFailure(errorMessage));
    yield put(
      addNotification({
        message: errorMessage,
        type: "error",
      })
    );
  }
}

function* redeemPointsSaga(
  action: PayloadAction<{
    amount: number;
    description: string;
    rewardtier: string;
  }>
) {
  try {
    const response: { balance: number; rewardtier: any } = yield call(
      loyaltyApi.redeemPoints,
      action.payload
    );
    yield put(redeemPointsSuccess(response));
    yield put(
      addNotification({
        message: `Successfully redeemed points!`,
        type: "success",
      })
    );
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ?? "Failed to redeem points";
    yield put(redeemPointsFailure(errorMessage));
    yield put(
      addNotification({
        message: errorMessage,
        type: "error",
      })
    );
  }
}

export function* loyaltySaga() {
  yield takeLatest(fetchBalanceRequest.type, fetchBalanceSaga);
  yield takeLatest(fetchHistoryRequest.type, fetchHistorySaga);
  yield takeLatest(earnPointsRequest.type, earnPointsSaga);
  yield takeLatest(redeemPointsRequest.type, redeemPointsSaga);
  yield takeLatest(fetchRewardTierRequest.type, fetchRewardTierSaga);
}
