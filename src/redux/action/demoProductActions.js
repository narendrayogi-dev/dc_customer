import {
  FETCH_DEMO_PRODUCT_REQUEST,
  FETCH_DEMO_PRODUCT_SUCCESS,
  FETCH_DEMO_PRODUCT_FAILURE,
  FILTER_DEMO_PRODUCT,
  LOAD_MORE_DEMO_PRODUCTS,
  APPLY_FILTER_SORT,
  MODIFY_DEMO_PRODUCT,
  MODIFY_FILTER_DEMO_PRODUCT,
  APPLY_RESET_FILTER_SORT,
  MODIFY_ALL_DEMO_PRODUCT,
  APPLY_RESET_FILTER_SORT_PAGE_DEMO,
  APPLY_FILTER_SORT_DEMO,
} from './ActionTypes';

// DemoProduct actions
export const fetchDemoProductRequest = () => ({
  type: FETCH_DEMO_PRODUCT_REQUEST,
});

export const fetchDemoProductSuccess = products => ({
  type: FETCH_DEMO_PRODUCT_SUCCESS,
  payload: products,
});

export const fetchDemoProductFailure = error => ({
  type: FETCH_DEMO_PRODUCT_FAILURE,
  payload: error,
});
export const modifyDemoProduct = data => ({
  type: MODIFY_DEMO_PRODUCT,
  payload: data,
});

export const modifyFilterDemoProduct = data => ({
  type: MODIFY_FILTER_DEMO_PRODUCT,
  payload: data,
});

export const modifyAllDemoProduct = data => ({
  type: MODIFY_ALL_DEMO_PRODUCT,
  payload: data,
});

export const loadMoreDemoProduct = params => ({
  type: LOAD_MORE_DEMO_PRODUCTS,
  payload: params,
});

export const applyFilterSort_demo = action => ({
  type: APPLY_FILTER_SORT_DEMO,
  payload: action,
});

export const applyResetFilterSort_page_demo = action => ({
  type: APPLY_RESET_FILTER_SORT_PAGE_DEMO,
  payload: action,
});
