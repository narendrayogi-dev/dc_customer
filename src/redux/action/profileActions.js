import {
  FETCH_EDIT_PROFILE_FAILURE,
  FETCH_EDIT_PROFILE_REQUEST,
  FETCH_EDIT_PROFILE_SUCCESS,
  FETCH_PROFILE_DATA_FAILURE,
  FETCH_PROFILE_DATA_REQUEST,
  FETCH_PROFILE_DATA_SUCCESS,
  FETCH_UPLOAD_PROFILE_IMAGE_FAILURE,
  FETCH_UPLOAD_PROFILE_IMAGE_REQUEST,
  FETCH_UPLOAD_PROFILE_IMAGE_SUCCESS,
} from './ActionTypes';

export const fetchProfileDataRequest = (navigation, screenName) => ({
  type: FETCH_PROFILE_DATA_REQUEST,
  payload: {navigation, screenName},
});

export const fetchProfileDataSuccess = profile => ({
  type: FETCH_PROFILE_DATA_SUCCESS,
  payload: profile,
});

export const fetchProfileDataFailure = error => ({
  type: FETCH_PROFILE_DATA_FAILURE,
  payload: error,
});

export const fetchEditProfileRequest = params => ({
  type: FETCH_EDIT_PROFILE_REQUEST,
  payload: {params},
});

export const fetchEditProfileSuccess = () => ({
  type: FETCH_EDIT_PROFILE_SUCCESS,
});

export const fetchEditProfileFailure = error => ({
  type: FETCH_EDIT_PROFILE_FAILURE,
  payload: error,
});

export const fetchUploadProfileImageRequest = params => ({
  type: FETCH_UPLOAD_PROFILE_IMAGE_REQUEST,
  payload: {params},
});

export const fetchUploadProfileImageSuccess = () => ({
  type: FETCH_UPLOAD_PROFILE_IMAGE_SUCCESS,
});

export const fetchUploadProfileImageFailure = error => ({
  type: FETCH_UPLOAD_PROFILE_IMAGE_FAILURE,
  payload: error,
});
