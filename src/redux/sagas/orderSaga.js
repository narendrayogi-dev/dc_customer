/* eslint-disable prettier/prettier */
import {call, put, takeLatest} from 'redux-saga/effects';

import {BASE_URL, makeRequest} from '../../api/ApiInfo';
import {showSnack} from '../../components/Snackbar';
import {fetchOrderFailure, fetchOrderSuccess} from '../action/orderActions';
import {FETCH_ORDER_REQUEST} from '../action/ActionTypes';

function* fetchOrder(action) {
  try {
    const params_url = action?.payload || '';

    const responseData = yield call(
      makeRequest,
      `${BASE_URL}customer_order_history?${params_url}`,
    );

    // Handle the response here
    const {Status, Message} = responseData;

    if (Status === true) {
      const {Data} = responseData;

      yield put(fetchOrderSuccess(Data));
    } else {
      yield call(
        showSnack,
        Message,
        // error.message,
        null,
        true,
      );
      yield put(fetchOrderFailure(Message));
    }
  } catch (error) {
    yield call(
      showSnack,
      'Oops something went wrong. Please try again later',
      // error.message,
      null,
      true,
    );
    yield put(fetchOrderFailure(error.message));
  }
}

export function* watchFetchOrder() {
  yield takeLatest(FETCH_ORDER_REQUEST, fetchOrder);
}
