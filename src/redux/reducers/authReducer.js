import { BOOTSTRAP_AUTH, SET_APP_FLOW, SET_AUTHENTICATED } from '../action/authTypes';

const initialState = {
  flow: 'Splash',
  user: null,
  token: '',
  isAuthenticated: false,
  isRegister: '',
  activeStoreCode: '',
  isLoading: true, // 👈 ADD THIS
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case BOOTSTRAP_AUTH:
      return {
        ...state,
        isLoading: true,
      };

    case SET_APP_FLOW:
      return { ...state, flow: action.payload, isLoading: false };

    case SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    default:
      return state;
  }
}
