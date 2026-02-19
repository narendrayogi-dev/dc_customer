/* eslint-disable prettier/prettier */
import DeviceInfo from 'react-native-device-info';
import {
  FETCH_HOME_DATA_FAILURE,
  FETCH_HOME_DATA_REQUEST,
  FETCH_HOME_DATA_SUCCESS,
  MODIFY_CART_DETAIL,
  MODIFY_NEW_ARRIVE_PRODUCT,
  MODIFY_PROFILE,
} from '../action/ActionTypes';

const initialHomeState = {
  homeData: {
    arrival_products: [],
    cart_detail: {},
    categories: [],
    profile: {},
    version: DeviceInfo.getVersion(),
  },
  isLoading: false,
  error: null,
};

const homeReducer = (state = initialHomeState, action) => {
  switch (action.type) {
    case FETCH_HOME_DATA_REQUEST:
      console.log(FETCH_HOME_DATA_REQUEST);
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case FETCH_HOME_DATA_SUCCESS:
      console.log(FETCH_HOME_DATA_SUCCESS);
      return {
        ...state,
        homeData: {...action.payload, version: DeviceInfo.getVersion()},
        isLoading: false,
      };
    case FETCH_HOME_DATA_FAILURE:
      console.log(FETCH_HOME_DATA_FAILURE, action.payload);
      return {
        ...state,
        homeData: {
          arrival_products: [],
          cart_detail: {},
          categories: [],
          profile: {},
          version: DeviceInfo.getVersion(),
        },
        isLoading: false,
        error: action.payload,
      };

    case MODIFY_NEW_ARRIVE_PRODUCT:
      console.log(MODIFY_NEW_ARRIVE_PRODUCT);
      return {
        ...state,
        homeData: {
          ...state.homeData,
          arrival_products: action.payload,
        },
      };

    case MODIFY_CART_DETAIL:
      console.log(MODIFY_CART_DETAIL, action.payload);
      return {
        ...state,
        homeData: {
          ...state.homeData,
          cart_detail: action.payload,
        },
      };

    case MODIFY_PROFILE:
      console.log(MODIFY_PROFILE);
      return {
        ...state,
        homeData: {
          ...state.homeData,
          profile: updateProfile(action.payload, state.homeData.profile),
        },
      };

    default:
      return state;
  }
};

export default homeReducer;

const updateProfile = (update, profile) => {
  let obj = profile;
  for (let key in update) {
    obj = {...obj, [key]: update[key]};
  }
  return obj;
};
