import {call, put, takeLatest} from 'redux-saga/effects';
import {
  fetchDeleteStoreFailure,
  fetchDeleteStoreSuccess,
  fetchStoresFailure,
  fetchStoresSuccess,
} from '../action/storeActions';
import {
  FETCH_DELETE_STORE_REQUEST,
  FETCH_STORES_REQUEST,
} from '../action/ActionTypes';

import {BASE_URL, makeRequest} from '../../api/ApiInfo';
import {async_keys, getData} from '../../api/UserPreference';
import {showSnack} from '../../components/Snackbar';

function* fetchStores(action) {
  try {
    const responseData = yield call(
      makeRequest,
      `${BASE_URL}store_request_list`,
    );

    // Handle the response here
    const {Status, Message} = responseData;
    if (Status === true) {
      const {Data} = responseData;
      yield put(fetchStoresSuccess(Data));

      if (action?.payload?.navigation && action.payload?.active_store_code) {
        action?.payload?.navigation?.navigate('HomeScreen');
      }
    } else {
      yield call(
        showSnack,
        Message,
        // error.message,
        null,
        true,
      );
      yield put(fetchStoresFailure(Message));
    }
  } catch (error) {
    // Handle any errors that occurred during the request
    yield put(fetchStoresFailure(error.message));
  }
}

function* fetchDeleteStore(action) {
  try {
    const {params} = action.payload;

    const responseData = yield call(
      makeRequest,
      `${BASE_URL}delete_store_request`,
      params,
      true,
    );

    // HANDLING RESPONSE
    const {Status, Message} = responseData;

    if (Status === true) {
      yield call(showSnack, 'User deleted successfully');
      yield put(fetchDeleteStoreSuccess());
      yield put({type: FETCH_STORES_REQUEST});
      // yield put({type: FETCH_USER_REQUEST});
    } else {
      yield call(showSnack, Message, null, true);
      yield put(fetchDeleteStoreFailure(Message));
    }
  } catch (error) {
    yield call(
      showSnack,
      'Oops something went wrong. Please try again later',
      // error.message,
      null,
      true,
    );
    yield put(fetchDeleteStoreFailure(error.message));
  }
}

export function* watchFetchStores() {
  yield takeLatest(FETCH_STORES_REQUEST, fetchStores);
  yield takeLatest(FETCH_DELETE_STORE_REQUEST, fetchDeleteStore);
}
