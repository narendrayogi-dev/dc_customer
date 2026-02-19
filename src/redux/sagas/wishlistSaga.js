import {call, put, takeLatest} from 'redux-saga/effects';
import {FETCH_WISHLIST_REQUEST} from '../action/ActionTypes';
import {async_keys, getData} from '../../api/UserPreference';
import {
  fetchWishlistFailure,
  fetchWishlistSuccess,
} from '../action/wishlistActions';
import {showSnack} from '../../components/Snackbar';
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

function* fetchWishlist(action) {
  try {
    const params_url = action?.payload || '';
    const responseData = yield call(
      makeRequest,
      `${BASE_URL}wishlist_items?${params_url}`,
    );

    // Handle the response here
    const {Status, Message} = responseData;

    if (Status === true) {
      const {Data} = responseData;

      yield put(fetchWishlistSuccess(Data));
    } else {
      yield call(showSnack, Message, null, true);
      yield put(fetchWishlistFailure(Message));
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
    yield put(fetchWishlistFailure(error.message));
  }
}

export function* watchFetchWishlist() {
  yield takeLatest(FETCH_WISHLIST_REQUEST, fetchWishlist);
}
