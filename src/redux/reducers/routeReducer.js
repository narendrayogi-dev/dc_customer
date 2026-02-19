import {SET_MAIN_ROUTE, SET_SWITCH_ROUTE} from '../action/ActionTypes';

const initialUserState = {
  mainRoute: 0,
  switchRoute: 'Splash',
};

const routeReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case SET_MAIN_ROUTE:
      //  console.log(SET_MAIN_ROUTE);
      return {
        ...state,
        mainRoute: action.payload,
      };

    case SET_SWITCH_ROUTE:
      //  console.log(SET_MAIN_ROUTE);
      return {
        ...state,
        switchRoute: action.payload,
      };
    default:
      return state;
  }
};

export default routeReducer;
