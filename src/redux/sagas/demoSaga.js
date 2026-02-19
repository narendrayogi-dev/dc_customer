/* eslint-disable prettier/prettier */
import {call, put, takeLatest} from 'redux-saga/effects';
import {FETCH_DEMO_DATA_REQUEST} from '../action/ActionTypes';
import {
  fetchDemoDataFailure,
  fetchDemoDataSuccess,
} from '../action/demoActions';
import {async_keys, clearData, getData} from '../../api/UserPreference';
import {showSnack} from '../../components/Snackbar';
import {BASE_URL, makeRequest} from '../../api/ApiInfo';
import {networkFailed} from '../action/networkFailed';
import {fetchDemoProductSuccess} from '../action/demoProductActions';

function* fetchDemo(action) {
  try {
    const responseData = yield call(makeRequest, `${BASE_URL}get_demo_store`);

    // Handle the response here
    const {Status, Message} = responseData;

    console.log('demo store data response', responseData);

    if (Status === true) {
      const {Data} = responseData;
      yield put(fetchDemoDataSuccess(Data));
      yield put(fetchDemoProductSuccess(Data.products));
    } else {
      yield call(showSnack, Message, null, true);
      yield put(fetchDemoDataFailure(Message));
    }
  } catch (error) {
    // Handle any errors that occurred during the request
    yield put(fetchDemoDataFailure(error.message));
    yield put(networkFailed(error.message === 'Network request failed'));
  }
}

export function* watchFetchDemo() {
  yield takeLatest(FETCH_DEMO_DATA_REQUEST, fetchDemo);
}
