import {dateTimeFormatter} from '../../components/dateTimeFormatter';
import {
  FETCH_ORDER_FAILURE,
  FETCH_ORDER_REQUEST,
  FETCH_ORDER_SUCCESS,
} from '../action/ActionTypes';

const initialOrderState = {
  allOrderData: [],
  filteredOrderData: [],
  othersOrderData: {},
  isLoading: false,
  loader: false,
  error: null,
};

const orderReducer = (state = initialOrderState, action) => {
  switch (action.type) {
    case FETCH_ORDER_REQUEST:
      //  console.log(FETCH_ORDER_REQUEST);
      return {
        ...state,
        isLoading: state.allOrderData.length === 0,

        loader: true,
        error: null,
      };
    case FETCH_ORDER_SUCCESS:
      //  console.log(FETCH_ORDER_SUCCESS);
      const {data, ...rest} = action.payload;
      return {
        ...state,
        allOrderData: data,
        filteredOrderData: data.map(item => ({
          ...item,
          created_at: dateTimeFormatter(item.created_at),
        })),
        othersOrderData: rest,
        isLoading: false,
        loader: false,
      };
    case FETCH_ORDER_FAILURE:
      //  console.log(FETCH_ORDER_FAILURE);
      return {
        ...state,
        allOrderData: [],
        isLoading: false,
        loader: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default orderReducer;
