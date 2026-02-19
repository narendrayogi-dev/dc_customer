import { put, takeLatest, call } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { setAppFlow, setAuthenticated } from '../action/authActions';
import {
  async_keys,
  getData,
  removeData,
  storeData,
} from '../../api/UserPreference';

import {
  BOOTSTRAP_AUTH,
  LOGIN_SUCCESS,
  REGISTER_SUCCESS,
  LOGOUT_REQUEST,
} from '../action/authTypes';
import { BASE_URL } from '../../api/ApiInfo';


/* ================= BOOTSTRAP ================= */

function* bootstrapAuthFlow() {
  try {
    const token = yield call(getData, async_keys.user_token);

    if (!token) {
      yield put(setAppFlow('LoggedOut'));
      return;
    }

    yield put(setAppFlow('LoggedIn'));

  } catch {
    yield put(setAppFlow('LoggedOut'));
  }
}

/* ================= LOGIN ================= */

function* loginSuccessFlow(action) {
  try {

    console.log("Action print here", "action");
    
    const { accessToken, is_register, active_store_code } = action.payload;

    yield call(storeData, async_keys.user_token, accessToken);
    yield call(storeData, async_keys.is_register, is_register);

    if (active_store_code) {
      yield call(storeData, async_keys.active_store_code, active_store_code);
    }

    yield put(setAuthenticated(true));
    yield put(setAppFlow('LoggedIn'));


  } catch (error) {
    console.log('login error:', error);
    yield put(setAppFlow('LoggedOut'));
  }
}

/* ================= REGISTER ================= */

function* registerSuccessFlow(action) {
  try {
    const { is_register, active_store_code } = action.payload;

    // update registration status
    yield call(storeData, async_keys.is_register, is_register);

    // update store if backend sends
    if (active_store_code) {
      yield call(storeData, async_keys.active_store_code, active_store_code);
    }

    // customer stays logged in
    yield put(setAppFlow('LoggedIn'));

  } catch (error) {
    console.log('register error:', error);
    yield put(setAppFlow('LoggedOut'));
  }
}

/* ================= LOGOUT ================= */

export const clearAllData = async () => {
  await AsyncStorage.clear();
};

function logoutApi(token) {
  return fetch(`${BASE_URL}logout`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.json());
}

function* logoutFlow() {
  try {
    const token = yield call(getData, async_keys.user_token);

    yield put(setAuthenticated(false));
    // if (token) yield call(logoutApi, token);

    yield call(clearAllData);
    

    yield call(removeData, async_keys.user_token);
    yield call(removeData, async_keys.is_register);
    yield call(removeData, async_keys.active_store_code);
    
    yield put(setAppFlow('LoggedOut'));

  } catch {
    yield put(setAppFlow('LoggedOut'));
  }
}


export function* watchAuthSaga() {
  yield takeLatest(BOOTSTRAP_AUTH, bootstrapAuthFlow);
  yield takeLatest(LOGIN_SUCCESS, loginSuccessFlow);
  yield takeLatest(REGISTER_SUCCESS, registerSuccessFlow);
  yield takeLatest(LOGOUT_REQUEST, logoutFlow);
}
