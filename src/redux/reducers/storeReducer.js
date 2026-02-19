import {
  FETCH_STORES_REQUEST,
  FETCH_STORES_SUCCESS,
  FETCH_STORES_FAILURE,
  FETCH_DELETE_STORE_REQUEST,
  FETCH_DELETE_STORE_SUCCESS,
  FETCH_DELETE_STORE_FAILURE,
  SEARCH_ACTIVE_STORES,
  JUST_STORE_UPDATED,
} from '../action/ActionTypes';
// variant increase and decrease
import {addToCart, removeFromCart} from '../action/ActionTypes';

const initialStoresState = {
  allStoreList: [],
  activeStoreList: [],
  pendingStoreList: [],
  isStoreUpdated: false,
  isLoading: false,
  loader: false,
  error: null,
  cartItems: [],
};

const storesReducer = (state = initialStoresState, action) => {
  switch (action.type) {
    case FETCH_STORES_REQUEST:
      //  console.log(FETCH_STORES_REQUEST);
      return {
        ...state,
        isLoading: state.allStoreList.length === 0,
        loader: true,
        error: null,
      };
    case FETCH_STORES_SUCCESS:
      //  console.log(FETCH_STORES_SUCCESS);
      const activeList = action.payload.filter(item => item.status == 1);
      const pendingList = action.payload.filter(item => item.status == 0);
      return {
        ...state,
        allStoreList: action.payload,
        activeStoreList: activeList,
        pendingStoreList: pendingList,
        isLoading: false,
        loader: false,
      };
    case FETCH_STORES_FAILURE:
      //  console.log(FETCH_STORES_FAILURE);
      return {
        ...state,
        allStoreList: [],
        activeStoreList: [],
        pendingStoreList: [],
        isLoading: false,
        loader: false,
        error: action.payload,
      };

    case FETCH_DELETE_STORE_REQUEST:
      //  console.log(FETCH_DELETE_STORE_REQUEST);
      return {
        ...state,
        loader: true,
        error: null,
      };
    case FETCH_DELETE_STORE_SUCCESS:
      //  console.log(FETCH_DELETE_STORE_SUCCESS);
      return {
        ...state,
        loader: false,
      };
    case FETCH_DELETE_STORE_FAILURE:
      //  console.log(FETCH_DELETE_STORE_FAILURE);
      return {
        ...state,
        loader: false,
        error: action.payload,
      };

    case SEARCH_ACTIVE_STORES:
      //  console.log(SEARCH_ACTIVE_STORES);
      return {
        ...state,
        activeStoreList: filterBySearch(action.payload, state.allStoreList, 1),
      };

    case JUST_STORE_UPDATED:
      return {
        ...state,
        isStoreUpdated: action.payload,
      };

    case addToCart:
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };

    case removeFromCart:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          item => item.id !== action.payload.id,
        ),
      };

    default:
      return state;
  }
};

export default storesReducer;

const filterBySearch = (text, allStore, status) => {
  const data = allStore.filter(item => item.status == status);
  if (!text) {
    return data;
  } else {
    let filteredData = data.filter(item => {
      const searchPattern = text.toUpperCase();

      const {vendor_name, store_name} = item;
      const vendor = vendor_name.toUpperCase();
      const store = store_name.toUpperCase();
      const found =
        vendor.indexOf(searchPattern) > -1 || store.indexOf(searchPattern) > -1;

      return found;
    });

    return filteredData;
  }
};
