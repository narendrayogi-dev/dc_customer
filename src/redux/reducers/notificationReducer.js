import {dateTimeFormatter} from '../../components/dateTimeFormatter';
import {
  FETCH_MUTE_NOTIFICATION_FAILURE,
  FETCH_MUTE_NOTIFICATION_REQUEST,
  FETCH_MUTE_NOTIFICATION_SUCCESS,
  FETCH_NOTIFICATION_FAILURE,
  FETCH_NOTIFICATION_REQUEST,
  FETCH_NOTIFICATION_SUCCESS,
} from '../action/ActionTypes';

const initialUserState = {
  allNotificationData: [],
  filteredNotificationData: [],
  isLoading: false,
  error: null,
};

const notificationReducer = (state = initialUserState, action) => {
  // console.log('userRed', state.activeUserAssending);
  switch (action.type) {
    case FETCH_NOTIFICATION_REQUEST:
      //  console.log(FETCH_NOTIFICATION_REQUEST);
      return {
        ...state,
        isLoading: state.allNotificationData.length === 0,
        error: null,
      };
    case FETCH_NOTIFICATION_SUCCESS:
      //  console.log(FETCH_NOTIFICATION_SUCCESS);
      return {
        ...state,
        allNotificationData: action.payload,
        filteredNotificationData: applyDateFormat(action.payload.notifications),
        isLoading: false,
      };
    case FETCH_NOTIFICATION_FAILURE:
      //  console.log(FETCH_NOTIFICATION_FAILURE);
      return {
        ...state,
        allNotificationData: [],
        filteredNotificationData: [],
        isLoading: false,
        error: action.payload,
      };

    case FETCH_MUTE_NOTIFICATION_REQUEST:
      //  console.log(FETCH_MUTE_NOTIFICATION_REQUEST);
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_MUTE_NOTIFICATION_SUCCESS:
      //  console.log(FETCH_MUTE_NOTIFICATION_SUCCESS);
      return {
        ...state,
        isLoading: false,
      };
    case FETCH_MUTE_NOTIFICATION_FAILURE:
      //  console.log(FETCH_MUTE_NOTIFICATION_FAILURE);
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default notificationReducer;

const applyDateFormat = data => {
  try {
    const result = data.map(item => {
      const formatedDate = dateTimeFormatter(item.created_at.toString());
      const parts = formatedDate.split(' ');
      //  console.log('formatter', parts);
      const datePart = parts[0];
      const timePart = parts[1] + ' ' + parts[2];
      return {
        ...item,
        created_at: formatedDate,
        datePart,
        timePart,
      };
    });
    return result;
  } catch (error) {
    //  console.log('formater notification reducer', error);
  }
};
