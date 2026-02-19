import {dateTimeFormatter} from '../../components/dateTimeFormatter';
import {
  FETCH_WISHLIST_FAILURE,
  FETCH_WISHLIST_REQUEST,
  FETCH_WISHLIST_SUCCESS,
  FILTER_SEARCH_WISHLIST,
} from '../action/ActionTypes';

const initialUserState = {
  allWishlistData: [],
  filteredWishlistData: [],
  othersWishlistData: {},
  isLoading: false,
  error: null,
};

const wishlistReducer = (state = initialUserState, action) => {
  // console.log('userRed', state.activeUserAssending);
  switch (action.type) {
    case FETCH_WISHLIST_REQUEST:
      //  console.log(FETCH_WISHLIST_REQUEST);
      return {
        ...state,
        isLoading: state.allWishlistData.length === 0,
        error: null,
      };
    case FETCH_WISHLIST_SUCCESS:
      //  console.log(FETCH_WISHLIST_SUCCESS);
      const {data, ...rest} = action.payload;
      return {
        ...state,
        allWishlistData: data,
        filteredWishlistData: formatter(data),
        othersWishlistData: rest,
        isLoading: false,
      };
    case FETCH_WISHLIST_FAILURE:
      //  console.log(FETCH_WISHLIST_FAILURE);
      return {
        ...state,
        allWishlistData: [],
        filteredWishlistData: [],
        isLoading: false,
        error: action.payload,
      };

    case FILTER_SEARCH_WISHLIST:
      //  console.log(FILTER_SEARCH_WISHLIST);
      return {
        ...state,
        filteredWishlistData: formatter(action.payload),
      };

    default:
      return state;
  }
};

export default wishlistReducer;

const formatter = data => {
  const result = data?.map(item => ({
    ...item,
    created_at:
      dateTimeFormatter(item?.created_at.toString()) || item?.created_at,
  }));
  return result;
};
