/* eslint-disable prettier/prettier */
import {call, put, takeLatest} from 'redux-saga/effects';
import {FETCH_HOME_DATA_REQUEST} from '../action/ActionTypes';
import {
  fetchHomeDataFailure,
  fetchHomeDataSuccess,
} from '../action/homeActions';
import {async_keys, clearData, getData} from '../../api/UserPreference';
import {showSnack} from '../../components/Snackbar';
import {BASE_URL, makeRequest} from '../../api/ApiInfo';
import {networkFailed} from '../action/networkFailed';
import {fetchStoresRequest, storeJustUpdated} from '../action/storeActions';
import { navigate } from '../../routes/NavigationService';
import { logoutRequest } from '../action/authActions';


function* fetchHome(action) {
  try {
    const responseData = yield call(makeRequest, `${BASE_URL}get_home_data`);

    // Handle the response here
    const {Status, Message} = responseData;

    if (Status === true) {
      yield put(storeJustUpdated(false));

      const {Data} = responseData;
      yield put(fetchHomeDataSuccess(Data));

      const {fetchStore, navigation} = action.payload;
      if (!Data.profile?.active_store_code) {
        if (action.payload) {
          if (navigation) {
            navigate('Store', {
              screen: 'StoreScreen',
            })
          }
        }
      }
      if (action.payload) {
        if (fetchStore && navigation) {
          yield put(
            fetchStoresRequest(navigation, Data.profile?.active_store_code),
          );
        }
      }
    } else if (
      responseData.status === 'unauthrozed' ||
      responseData.message === 'Unauthenticated.'
    ) {
      if (action.payload) {
        const {navigation} = action.payload;
        if (navigation) {
          yield call(clearData);
          yield call(
            showSnack,
            'Your session has expired. Please login to continue',
            null,
            true,
          );

          yield put(fetchHomeDataFailure(Message));
          yield put(logoutRequest())
          // navigation.navigate('LoggedOut');
        }
      }
    } else {
      yield call(showSnack, Message, null, true);
      yield put(fetchHomeDataFailure(Message));
    }
  } catch (error) {
    // Handle any errors that occurred during the request
    yield put(fetchHomeDataFailure(error.message));
  }
}

export function* watchFetchHome() {
  yield takeLatest(FETCH_HOME_DATA_REQUEST, fetchHome);
}
