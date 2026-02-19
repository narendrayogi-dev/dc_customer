import {
  FETCH_CATEGORY_REQUEST,
  FETCH_CATEGORY_SUCCESS,
  FETCH_CATEGORY_FAILURE,
} from './ActionTypes';

// Category actions
export const fetchCategoryRequest = () => ({
  type: FETCH_CATEGORY_REQUEST,
});

export const fetchCategorySuccess = categories => ({
  type: FETCH_CATEGORY_SUCCESS,
  payload: categories,
});

export const fetchCategoryFailure = error => ({
  type: FETCH_CATEGORY_FAILURE,
  payload: error,
});
