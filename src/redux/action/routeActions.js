import {SET_MAIN_ROUTE, SET_SWITCH_ROUTE} from './ActionTypes';

export const setMainRoute = index => ({
  type: SET_MAIN_ROUTE,
  payload: index,
});

export const setSwitchRoute = routeName => ({
  type: SET_SWITCH_ROUTE,
  payload: routeName,
});
