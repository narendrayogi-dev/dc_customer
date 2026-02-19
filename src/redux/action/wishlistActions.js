import {
  FETCH_WISHLIST_FAILURE,
  FETCH_WISHLIST_REQUEST,
  FETCH_WISHLIST_SUCCESS,
  FILTER_SEARCH_WISHLIST,
} from './ActionTypes';

export const fetchWishlistRequest = params_url => ({
  type: FETCH_WISHLIST_REQUEST,
  payload: params_url || '',
});

export const fetchWishlistSuccess = data => ({
  type: FETCH_WISHLIST_SUCCESS,
  payload: data,
});

export const fetchWishlistFailure = error => ({
  type: FETCH_WISHLIST_FAILURE,
  payload: error,
});

export const filterSearchWishlist = data => ({
  type: FILTER_SEARCH_WISHLIST,
  payload: data,
});
