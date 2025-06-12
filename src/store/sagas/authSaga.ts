import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  loginRequest,
  registerRequest,
  loginSuccess,
  registerSuccess,
  loginFailure,
  registerFailure,
} from "../slices/authSlice";
import { addNotification } from "../slices/uiSlice";
import { authApi } from "../../services/apiClient";

function* loginSaga(action: PayloadAction<{ phoneNumber: string }>) {
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

function* registerSaga(
  action: PayloadAction<{ name: string; email: string; phoneNumber: string }>
) {
  try {
    const response: { user: any; token: string } = yield call(
      authApi.register,
      action.payload
    );
    yield put(registerSuccess(response));
    yield put(
      addNotification({
        message: "Registration successful! Welcome to Square Loyalty!",
        type: "success",
      })
    );
  } catch (error: any) {
    const errorMessage = error.response?.data?.message ?? "Registration failed";
    yield put(registerFailure(errorMessage));
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
  yield takeLatest(registerRequest.type, registerSaga);
}
