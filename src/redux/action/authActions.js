import { BOOTSTRAP_AUTH, LOGIN_SUCCESS, LOGOUT_REQUEST, REGISTER_SUCCESS, REGISTRATION_COMPLETED, SET_APP_FLOW, SET_AUTHENTICATED } from "./authTypes";

export const setAppFlow = flow => ({
  type: SET_APP_FLOW,
  payload: flow, // Splash | LoggedOut | ProductCreation | LoggedIn
});

export const logoutRequest = () => ({
  type: LOGOUT_REQUEST,
});

export const bootstrapAuth = () => ({
  type: BOOTSTRAP_AUTH,
});

export const loginSuccess = data => ({
  type: LOGIN_SUCCESS,
  payload: data,
});


export const setAuthenticated = value => ({
  type: SET_AUTHENTICATED,
  payload: value,
});


export const registerSuccess = data => ({
  type: REGISTER_SUCCESS,
  payload: data,
});

export const registerComplete = data => ({
  type: REGISTRATION_COMPLETED,
  payload: data,
});

