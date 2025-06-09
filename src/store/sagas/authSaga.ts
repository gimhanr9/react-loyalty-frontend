import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";

import { authApi } from "../../services/apiClient";
import { addNotification } from "../slices/uiSlice";
import { loginFailure, loginRequest, loginSuccess } from "../slices/authSlice";

function* loginSaga(
  action: PayloadAction<{ email: string; password: string }>
) {
  try {
    const response: { user: any; token: string } = yield call(
      authApi.login,
      action.payload
    );
    yield put(loginSuccess(response));
    yield put(
      addNotification({
        message: "Login successful!",
        type: "success",
      })
    );
  } catch (error: any) {
    const errorMessage = error.response?.data?.message ?? "Login failed";
    yield put(loginFailure(errorMessage));
    yield put(
      addNotification({
        message: errorMessage,
        type: "error",
      })
    );
  }
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, loginSaga);
}
