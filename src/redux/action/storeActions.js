import {
  FETCH_STORES_REQUEST,
  FETCH_STORES_SUCCESS,
  FETCH_STORES_FAILURE,
  FETCH_DELETE_STORE_REQUEST,
  FETCH_DELETE_STORE_SUCCESS,
  FETCH_DELETE_STORE_FAILURE,
  SEARCH_ACTIVE_STORES,
  JUST_STORE_UPDATED,
} from './ActionTypes';

// Category actions
export const fetchStoresRequest = (navigation, active_store_code) => ({
  type: FETCH_STORES_REQUEST,
  payload: {navigation, active_store_code},
});

export const fetchStoresSuccess = stores => ({
  type: FETCH_STORES_SUCCESS,
  payload: stores,
});

export const fetchStoresFailure = text => ({
  type: FETCH_STORES_FAILURE,
  payload: text,
});

export const fetchDeleteStoreRequest = params => ({
  type: FETCH_DELETE_STORE_REQUEST,
  payload: {params},
});

export const fetchDeleteStoreSuccess = () => ({
  type: FETCH_DELETE_STORE_SUCCESS,
});

export const fetchDeleteStoreFailure = error => ({
  type: FETCH_DELETE_STORE_FAILURE,
  payload: error,
});

export const searchActiveStores = text => ({
  type: SEARCH_ACTIVE_STORES,
  payload: text,
});

export const storeJustUpdated = payload => ({
  type: JUST_STORE_UPDATED,
  payload: payload,
});
