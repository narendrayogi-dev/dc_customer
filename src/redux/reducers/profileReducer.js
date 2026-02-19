import {
  FETCH_EDIT_PROFILE_FAILURE,
  FETCH_EDIT_PROFILE_REQUEST,
  FETCH_EDIT_PROFILE_SUCCESS,
  FETCH_PROFILE_DATA_FAILURE,
  FETCH_PROFILE_DATA_REQUEST,
  FETCH_PROFILE_DATA_SUCCESS,
  FETCH_UPLOAD_PROFILE_IMAGE_FAILURE,
  FETCH_UPLOAD_PROFILE_IMAGE_REQUEST,
  FETCH_UPLOAD_PROFILE_IMAGE_SUCCESS,
} from '../action/ActionTypes';

const initialProductState = {
  profileData: {},
  // storeName: '',
  // nameLoader: false,
  isLoading: false,
  error: null,
};

const profileReducer = (state = initialProductState, action) => {
  switch (action.type) {
    // SAVING PROFILES
    case FETCH_PROFILE_DATA_REQUEST:
      //  console.log(FETCH_PROFILE_DATA_REQUEST);
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case FETCH_PROFILE_DATA_SUCCESS:
      //  console.log(FETCH_PROFILE_DATA_SUCCESS);
      return {
        ...state,
        profileData: action.payload || {},
        isLoading: false,
      };
    case FETCH_PROFILE_DATA_FAILURE:
      //  console.log(FETCH_PROFILE_DATA_FAILURE);
      return {
        ...state,
        profileData: {},
        isLoading: false,
        error: action.payload,
      };

    case FETCH_EDIT_PROFILE_REQUEST:
      //  console.log(FETCH_EDIT_PROFILE_REQUEST);
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case FETCH_EDIT_PROFILE_SUCCESS:
      //  console.log(FETCH_EDIT_PROFILE_SUCCESS);
      return {
        ...state,
        isLoading: false,
      };
    case FETCH_EDIT_PROFILE_FAILURE:
      //  console.log(FETCH_EDIT_PROFILE_FAILURE);
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case FETCH_UPLOAD_PROFILE_IMAGE_REQUEST:
      //  console.log(FETCH_UPLOAD_PROFILE_IMAGE_REQUEST);
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case FETCH_UPLOAD_PROFILE_IMAGE_SUCCESS:
      //  console.log(FETCH_UPLOAD_PROFILE_IMAGE_SUCCESS);
      return {
        ...state,
        isLoading: false,
      };
    case FETCH_UPLOAD_PROFILE_IMAGE_FAILURE:
      //  console.log(FETCH_UPLOAD_PROFILE_IMAGE_FAILURE);
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default profileReducer;
