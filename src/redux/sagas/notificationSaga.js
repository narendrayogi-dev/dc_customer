import {call, put, takeLatest} from 'redux-saga/effects';
import {async_keys, getData} from '../../api/UserPreference';

import {showSnack} from '../../components/Snackbar';
import {BASE_URL, makeRequest} from '../../api/ApiInfo';
import {
  FETCH_MUTE_NOTIFICATION_REQUEST,
  FETCH_NOTIFICATION_REQUEST,
} from '../action/ActionTypes';
import {
  fetchMuteNotificationFailure,
  fetchMuteNotificationSuccess,
  fetchNotificationFailure,
  fetchNotificationSuccess,
} from '../action/notificationActions';

function* fetchNotification() {
  try {
    const responseData = yield call(makeRequest, `${BASE_URL}get_notification`);

    // Handle the response here

    const {Status, Message} = responseData;

    if (Status === true) {
      const {Data} = responseData;

      yield put(fetchNotificationSuccess(Data));
    } else {
      yield call(
        showSnack,
        Message,
        // error.message,
        null,
        true,
      );
      yield put(fetchNotificationFailure(Message));
    }
  } catch (error) {
    console.log('error--fetchNotificationFailure', error);
    // Handle any errors that occurred during the request
    yield call(
      showSnack,
      'Oops something went wrong. Please try again later',
      // error.message,
      null,
      true,
    );
    yield put(fetchNotificationFailure(error.message));
  }
}

function* fetchMuteNotification() {
  try {
    const responseData = yield call(makeRequest, `${BASE_URL}notify_on_off`);

    // Handle the response here

    const {Status, Message} = responseData;

    if (Status === true) {
      const {Data} = responseData;

      yield put(fetchMuteNotificationSuccess(Data));
    } else {
      yield call(
        showSnack,
        Message,
        // error.message,
        null,
        true,
      );
      yield put(fetchMuteNotificationFailure(Message));
    }
  } catch (error) {
    // Handle any errors that occurred during the request
    yield call(
      showSnack,
      'Oops something went wrong. Please try again later',
      // error.message,
      null,
      true,
    );
    yield put(fetchMuteNotificationFailure(error.message));
  }
}

export function* watchFetchNotification() {
  yield takeLatest(FETCH_NOTIFICATION_REQUEST, fetchNotification);
  yield takeLatest(FETCH_MUTE_NOTIFICATION_REQUEST, fetchMuteNotification);
}
