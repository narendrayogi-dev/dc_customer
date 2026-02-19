/* eslint-disable prettier/prettier */
import {call, put, takeLatest} from 'redux-saga/effects';
import {
  fetchCategoryFailure,
  fetchCategorySuccess,
} from '../action/categoryActions';
import {FETCH_CATEGORY_REQUEST} from '../action/ActionTypes';

import {BASE_URL, makeRequest} from '../../api/ApiInfo';
import {async_keys, getData} from '../../api/UserPreference';
import {showSnack} from '../../components/Snackbar';

function* fetchCategories() {
  try {
    const responseData = yield call(
      makeRequest,
      `${BASE_URL}get_all_categories`,
      null,
      true,
    );

    // Handle the response here
    const {Status, Message} = responseData;

    if (Status === true) {
      const {Data} = responseData;
      Data.sort((a, b) => {
        const titleA = a.title.toUpperCase();
        const titleB = b.title.toUpperCase();
        if (titleA < titleB) {
          return -1;
        }
        if (titleA > titleB) {
          return 1;
        }
        return 0;
      });
      yield put(fetchCategorySuccess(Data));
    } else {
      yield call(
        showSnack,
        Message,
        // error.message,
        null,
        true,
      );
      yield put(fetchCategoryFailure(Message));
    }
  } catch (error) {
    yield call(
      showSnack,
      'Oops something went wrong. Please try again later',
      // error.message,
      null,
      true,
    );
    yield put(fetchCategoryFailure(error.message));
  }
}

export function* watchFetchCategories() {
  yield takeLatest(FETCH_CATEGORY_REQUEST, fetchCategories);
}
