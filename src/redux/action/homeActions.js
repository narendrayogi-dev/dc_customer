import {
  FETCH_HOME_DATA_FAILURE,
  FETCH_HOME_DATA_REQUEST,
  FETCH_HOME_DATA_SUCCESS,
  MODIFY_ALL_PRODUCT,
  MODIFY_CART_DETAIL,
  MODIFY_NEW_ARRIVE_PRODUCT,
  MODIFY_PROFILE,
} from './ActionTypes';

export const fetchHomeDataRequest = (navigation, fetchStore) => ({
  type: FETCH_HOME_DATA_REQUEST,
  payload: {navigation, fetchStore},
});

export const fetchHomeDataSuccess = data => ({
  type: FETCH_HOME_DATA_SUCCESS,
  payload: data,
});

export const fetchHomeDataFailure = error => ({
  type: FETCH_HOME_DATA_FAILURE,
  payload: error,
});

export const modifyNewArriveProduct = data => ({
  type: MODIFY_NEW_ARRIVE_PRODUCT,
  payload: data,
});

export const modifyCartDetail = data => ({
  type: MODIFY_CART_DETAIL,
  payload: data,
});

export const modifyProfile = data => ({
  type: MODIFY_PROFILE,
  payload: data,
});
