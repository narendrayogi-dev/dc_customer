import {
  FETCH_PRODUCT_REQUEST,
  FETCH_PRODUCT_SUCCESS,
  FETCH_PRODUCT_FAILURE,
  APPLY_FILTER_SORT,
  MODIFY_FILTER_PRODUCT,
  APPLY_RESET_FILTER_SORT,
  MODIFY_ALL_PRODUCT,
  APPLY_PAGE,
  CHANGE_INDEX_OF_PRODUCT,
} from '../action/ActionTypes';

const initialProductState = {
  allProductsData: [],
  filteredProductsData: [],
  othersProductData: {},
  sortBy: 'newest',
  filterBy: 0,
  page: 1,
  indexOfProduct: 0,
  isLoading: false,
  loader: true,
  error: null,
};

const productReducer = (state = initialProductState, action) => {
  switch (action.type) {
    case FETCH_PRODUCT_REQUEST:
      //  console.log(FETCH_PRODUCT_REQUEST);
      return {
        ...state,
        isLoading: state.allProductsData.length === 0,
        loader: state.allProductsData.length !== 0,
        error: null,
      };
    case FETCH_PRODUCT_SUCCESS:
      console.log(FETCH_PRODUCT_SUCCESS);
      const {data, ...rest} = action.payload;
      return {
        ...state,
        allProductsData: data || [],
        filteredProductsData: data || [],
        othersProductData: rest || {},
        isLoading: false,
        loader: false,
      };
    case FETCH_PRODUCT_FAILURE:
      console.log(FETCH_PRODUCT_FAILURE);
      return {
        ...state,
        allProductsData: [],
        filteredProductsData: [],
        othersProductData: {},
        isLoading: false,
        loader: false,
        error: action.payload,
      };

    case MODIFY_FILTER_PRODUCT:
      return {
        ...state,
        filteredProductsData: action.payload,
      };

    case MODIFY_ALL_PRODUCT:
      return {
        ...state,
        allProductsData: action.payload,
      };

    case APPLY_FILTER_SORT:
      console.log(APPLY_FILTER_SORT);
      return {
        ...state,
        sortBy: action?.payload?.sortBy || 'newest',
        filterBy: action?.payload?.filterBy || 0,
      };

    case APPLY_PAGE:
      console.log(APPLY_PAGE);
      return {
        ...state,
        page: action.payload,
      };

    case APPLY_RESET_FILTER_SORT:
      return {
        ...state,
        sortBy: 'newest',
        filterBy: 0,
        page: 1,
      };

    case CHANGE_INDEX_OF_PRODUCT:
      return {
        ...state,
        indexOfProduct: action.payload,
      };
    default:
      return state;
  }
};

export default productReducer;
