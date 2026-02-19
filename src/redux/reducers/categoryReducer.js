import {
  FETCH_CATEGORY_REQUEST,
  FETCH_CATEGORY_SUCCESS,
  FETCH_CATEGORY_FAILURE,
} from '../action/ActionTypes';

const initialCategoryState = {
  categories: [],
  isLoading: false,
  error: null,
};

const categoryReducer = (state = initialCategoryState, action) => {
  switch (action.type) {
    case FETCH_CATEGORY_REQUEST:
      //  console.log(FETCH_CATEGORY_REQUEST);
      return {
        ...state,
        isLoading: state.categories.length === 0,
        error: null,
      };
    case FETCH_CATEGORY_SUCCESS:
      //  console.log(FETCH_CATEGORY_SUCCESS);
      return {
        ...state,
        categories: action.payload,
        isLoading: false,
      };
    case FETCH_CATEGORY_FAILURE:
      //  console.log(FETCH_CATEGORY_FAILURE);
      return {
        ...state,
        categories: [],
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default categoryReducer;
