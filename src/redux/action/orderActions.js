import {
  FETCH_ORDER_FAILURE,
  FETCH_ORDER_REQUEST,
  FETCH_ORDER_SUCCESS,
} from './ActionTypes';

export const fetchOrderRequest = params_url => ({
  type: FETCH_ORDER_REQUEST,
  payload: params_url || '',
});

export const fetchOrderSuccess = data => ({
  type: FETCH_ORDER_SUCCESS,
  payload: data,
});

export const fetchOrderFailure = error => ({
  type: FETCH_ORDER_FAILURE,
  payload: error,
});
