import {call, put, takeLatest} from 'redux-saga/effects';
import {async_keys, clearData, getData} from '../../api/UserPreference';
import {
  fetchNewArrivalProductFailure,
  fetchNewArrivalProductSuccess,
  fetchProductFailure,
  fetchProductSuccess,
} from '../action/productActions';
import {
  FETCH_NEW_ARRIVAL_PRODUCT_REQUEST,
  FETCH_PRODUCT_REQUEST,
} from '../action/ActionTypes';
import {BASE_URL, makeRequest} from '../../api/ApiInfo';
import {showSnack} from '../../components/Snackbar';

function* fetchProduct(action) {
  try {
    const params_url = action?.payload || '';
    console.log(params_url,"productFetchurll")
    const responseData = yield call(
      makeRequest,
      `${BASE_URL}get_products?${params_url}`,
    );

    // Handling the response
    const {Status, Message} = responseData;

    if (Status === true) {
      const {Data} = responseData;
      yield put(fetchProductSuccess(Data));
    } else {
      yield put(fetchProductFailure(Message));

      yield call(showSnack, Message, null, true);
    }
  } catch (error) {
    yield call(
      showSnack,
      'Oops something went wrong. Please try again later',
      // error.message,
      null,
      true,
    );

    yield put(fetchProductFailure(error.message));
  }
}

export function* watchFetchProduct() {
  yield takeLatest(FETCH_PRODUCT_REQUEST, fetchProduct);
}
