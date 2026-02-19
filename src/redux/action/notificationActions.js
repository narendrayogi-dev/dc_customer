import {
  FETCH_MUTE_NOTIFICATION_FAILURE,
  FETCH_MUTE_NOTIFICATION_REQUEST,
  FETCH_MUTE_NOTIFICATION_SUCCESS,
  FETCH_NOTIFICATION_FAILURE,
  FETCH_NOTIFICATION_REQUEST,
  FETCH_NOTIFICATION_SUCCESS,
} from './ActionTypes';

export const fetchNotificationRequest = () => ({
  type: FETCH_NOTIFICATION_REQUEST,
});

export const fetchNotificationSuccess = data => ({
  type: FETCH_NOTIFICATION_SUCCESS,
  payload: data,
});

export const fetchNotificationFailure = error => ({
  type: FETCH_NOTIFICATION_FAILURE,
  payload: error,
});

export const fetchMuteNotificationRequest = () => ({
  type: FETCH_MUTE_NOTIFICATION_REQUEST,
});

export const fetchMuteNotificationSuccess = data => ({
  type: FETCH_MUTE_NOTIFICATION_SUCCESS,
  payload: data,
});

export const fetchMuteNotificationFailure = error => ({
  type: FETCH_MUTE_NOTIFICATION_FAILURE,
  payload: error,
});
