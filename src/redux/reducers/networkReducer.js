import {NETWORK_FAILED} from '../action/ActionTypes';

const initialHomeState = {
  networkError: false,
};

const networkReducer = (state = initialHomeState, action) => {
  switch (action.type) {
    case NETWORK_FAILED:
      return {
        ...state,
        networkError: action.payload,
      };
    default:
      return state;
  }
};

export default networkReducer;
