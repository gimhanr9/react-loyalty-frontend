import { all, fork } from "redux-saga/effects";
import { authSaga } from "./authSaga";
import { loyaltySaga } from "./loyaltySaga";

export function* rootSaga() {
  yield all([fork(authSaga), fork(loyaltySaga)]);
}
