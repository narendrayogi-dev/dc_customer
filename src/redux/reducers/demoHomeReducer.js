import DeviceInfo from 'react-native-device-info';
import {
  FETCH_DEMO_DATA_FAILURE,
  FETCH_DEMO_DATA_REQUEST,
  FETCH_DEMO_DATA_SUCCESS,
} from '../action/ActionTypes';

const demoInitialState = {
  demoHomeData: {
    arrival_products: [],
    cart_detail: {},
    categories: [],
    profile: {},
    version: DeviceInfo.getVersion(),
    banner: [],
    help_mobile_number: '',
  },
  isLoading: false,
  error: null,
};

const demoHomeReducer = (state = demoInitialState, action) => {
  switch (action.type) {
    case FETCH_DEMO_DATA_REQUEST:
      //  console.log(FETCH_DEMO_DATA_REQUEST);
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case FETCH_DEMO_DATA_SUCCESS:
      //  console.log(FETCH_DEMO_DATA_SUCCESS);
      const {
        categories,
        arrival_products,
        products,
        banner,
        help_mobile_number,
      } = action.payload;
      return {
        ...state,

        demoHomeData: {
          arrival_products,
          cart_detail: {},
          categories,
          profile: {},
          banner: banner,
          help_mobile_number,
        },
        isLoading: false,
      };
    case FETCH_DEMO_DATA_FAILURE:
      //  console.log(FETCH_DEMO_DATA_FAILURE);
      return {
        ...state,
        // demoData: {
        //   categories: [],
        //   arrival_products: [],
        //   products: [],
        // },
        isLoading: false,
        loader: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default demoHomeReducer;

const getTotalPage = data => {
  let calc_page = Number(data.length) / 40;

  const rounded_calc_page = Math.round(calc_page);

  if (calc_page !== rounded_calc_page) {
    calc_page = rounded_calc_page + 1;
  }

  return calc_page;
};

const setCurrentPage = (totalPages, cur_page, page) => {
  // console.log('setCurrentPage', {totalPages, cur_page, page});
  if (totalPages < page) {
    return cur_page;
  } else {
    return page;
  }
};

const applyPagination = (action, currentPage, gettingLength = false) => {
  console.log('applyPagination', {
    currentPage,
    callingFrom: action.callingFrom,
  });
  const {data, sortBy, filterBy} = action;
  //SORTING
  if (sortBy) {
    switch (sortBy) {
      case 1:
        data.sort((a, b) => Number(a.sp) - Number(b.sp));
        break;
      case 2:
        data.sort((a, b) => Number(b.sp) - Number(a.sp));
        break;
      case 3:
        data.sort((a, b) => {
          const first = new Date(a.created_at);
          const second = new Date(b.created_at);
          return first - second;
        });
        break;
      case 4:
        data.sort((a, b) => {
          const first = new Date(a.created_at);
          const second = new Date(b.created_at);
          return second - first;
        });
        break;
    }
  }

  let temp = data;
  //FILTERING
  if (filterBy && filterBy !== 0) {
    //  console.log('if (filterBy && filterBy !== 0)', {temp});
    temp = temp.filter(item => Number(item.category_id) == Number(filterBy));
  }
  //PAGINATE
  const productPerPage = 40;
  const startIndex = 0;
  const endIndex = productPerPage * currentPage;

  console.log('APPLY_PAGINATE', {startIndex, endIndex, currentPage});

  if (gettingLength) {
    return temp.length;
  } else {
    return temp.slice(startIndex, endIndex);
  }
};
