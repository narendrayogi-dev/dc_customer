import {call, put, takeLatest} from 'redux-saga/effects';
import {showSnack} from '../../components/Snackbar';
import {async_keys, clearData, getData} from '../../api/UserPreference';
import {BASE_URL, makeRequest} from '../../api/ApiInfo';
import {
  fetchEditProfileFailure,
  fetchEditProfileSuccess,
  fetchProfileDataFailure,
  fetchProfileDataSuccess,
  fetchUploadProfileImageFailure,
  fetchUploadProfileImageSuccess,
} from '../action/profileActions';
import {
  FETCH_EDIT_PROFILE_REQUEST,
  FETCH_PROFILE_DATA_REQUEST,
  FETCH_UPLOAD_PROFILE_IMAGE_REQUEST,
} from '../action/ActionTypes';
import {modifyProfile} from '../action/homeActions';

function* fetchProfile(action) {
  try {
    const responseData = yield call(makeRequest, `${BASE_URL}view_profile`);

    // HANDLING RESPONSE
    const {Status, Message} = responseData;

    if (Status === true) {
      const {Data} = responseData;
      yield put(fetchProfileDataSuccess(Data));
      if (action.payload) {
        const {navigation, screenName} = action.payload;
        if (navigation) {
          if (Data.active_store_code) {
            if (screenName) {
              navigation.navigate(screenName);
            }
          } else {
            navigation.navigate('StoreScreen');
          }
        }
      }
    } else {
      if (action.payload) {
        const {navigation, screenName} = action.payload;
        if (navigation) {
          yield call(clearData);
          navigation.navigate('LoggedOut');
        }
      }
      yield put(fetchProfileDataFailure(Message));
    }
  } catch (error) {
    yield put(fetchProfileDataFailure(error));
  }
}

function* fetchEditProfile(action) {
  try {
    const {params} = action.payload;

    const responseData = yield call(
      makeRequest,
      `${BASE_URL}upload_profile`,
      params,
      true,
    );

    // HANDLING RESPONSE
    const {Status, Message, Data} = responseData;
    console.log('edit profile response', responseData);

    if (Status === true) {
      yield showSnack(Message);
      // yield call(showSnack(Message));

      // const {Data} = responseData;
      yield put(fetchEditProfileSuccess());

      yield put(modifyProfile(params));
      // yield put({type: FETCH_PROFILE_DATA_REQUEST});
    } else {
      yield put(fetchEditProfileFailure(Message));
    }
  } catch (error) {
    yield showSnack(error.message);
    yield put(fetchEditProfileFailure(error.message));
  }
}

function* fetchUploadProfileImage(action) {
  try {
    const {params} = action.payload;
    const responseData = yield call(
      makeRequest,
      `${BASE_URL}upload_profile_image`,
      params,
      true,
    );

    // HANDLING RESPONSE
    const {Status, Message} = responseData;

    if (Status === true) {
      const {Data} = responseData;
      yield put(fetchUploadProfileImageSuccess());
      yield put(modifyProfile(Data));
      // yield put({type: FETCH_PROFILE_DATA_REQUEST});
    } else {
      // yield call(showSnack, Message, null, true);
      yield put(fetchUploadProfileImageFailure(Message));
    }
  } catch (error) {
    yield put(fetchUploadProfileImageFailure(error.message));
  }
}

export function* watchFetchProfile() {
  yield takeLatest(FETCH_PROFILE_DATA_REQUEST, fetchProfile);
  yield takeLatest(FETCH_EDIT_PROFILE_REQUEST, fetchEditProfile);
  yield takeLatest(FETCH_UPLOAD_PROFILE_IMAGE_REQUEST, fetchUploadProfileImage);
}
