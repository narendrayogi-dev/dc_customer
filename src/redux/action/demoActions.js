import {
  FETCH_DEMO_DATA_FAILURE,
  FETCH_DEMO_DATA_REQUEST,
  FETCH_DEMO_DATA_SUCCESS,
} from './ActionTypes';

export const fetchDemoDataRequest = navigation => ({
  type: FETCH_DEMO_DATA_REQUEST,
  payload: {navigation},
});

export const fetchDemoDataSuccess = data => ({
  type: FETCH_DEMO_DATA_SUCCESS,
  payload: data,
});

export const fetchDemoDataFailure = error => ({
  type: FETCH_DEMO_DATA_FAILURE,
  payload: error,
});
