import {
  FETCH_PRODUCT_REQUEST,
  FETCH_PRODUCT_SUCCESS,
  FETCH_PRODUCT_FAILURE,
  FILTER_PRODUCT,
  LOAD_MORE_PRODUCTS,
  APPLY_FILTER_SORT,
  MODIFY_PRODUCT,
  FETCH_NEW_ARRIVAL_PRODUCT_REQUEST,
  FETCH_NEW_ARRIVAL_PRODUCT_SUCCESS,
  FETCH_NEW_ARRIVAL_PRODUCT_FAILURE,
  MODIFY_FILTER_PRODUCT,
  APPLY_RESET_FILTER_SORT,
  MODIFY_ALL_PRODUCT,
  APPLY_PAGE,
  CHANGE_INDEX_OF_PRODUCT,
} from './ActionTypes';

// Product actions
export const fetchProductRequest = params_url => ({

  type: FETCH_PRODUCT_REQUEST,
  payload: params_url || '',
});

export const fetchProductSuccess = products => ({
  type: FETCH_PRODUCT_SUCCESS,
  payload: products,
});

export const fetchProductFailure = error => ({
  type: FETCH_PRODUCT_FAILURE,
  payload: error,
});
// Product actions
export const fetchNewArrivalProductRequest = () => ({
  type: FETCH_NEW_ARRIVAL_PRODUCT_REQUEST,
});

export const fetchNewArrivalProductSuccess = products => ({
  type: FETCH_NEW_ARRIVAL_PRODUCT_SUCCESS,
  payload: products,
});

export const fetchNewArrivalProductFailure = error => ({
  type: FETCH_NEW_ARRIVAL_PRODUCT_FAILURE,
  payload: error,
});

export const modifyProduct = data => ({
  type: MODIFY_PRODUCT,
  payload: data,
});

export const modifyFilterProduct = data => ({
  type: MODIFY_FILTER_PRODUCT,
  payload: data,
});

export const modifyAllProduct = data => ({
  type: MODIFY_ALL_PRODUCT,
  payload: data,
});

export const loadMoreProduct = params => ({
  type: LOAD_MORE_PRODUCTS,
  payload: params,
});

export const applyFilterSort = action => ({
  type: APPLY_FILTER_SORT,
  payload: action,
});

export const applyPage = action => ({
  type: APPLY_PAGE,
  payload: action,
});

export const applyResetFilterSort = () => ({
  type: APPLY_RESET_FILTER_SORT,
});

export const changeIndexOfProduct = index => ({
  type: CHANGE_INDEX_OF_PRODUCT,
  payload: index,
});
