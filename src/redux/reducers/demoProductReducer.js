import {
  FETCH_DEMO_PRODUCT_REQUEST,
  FETCH_DEMO_PRODUCT_SUCCESS,
  FETCH_DEMO_PRODUCT_FAILURE,
  LOAD_MORE_DEMO_PRODUCTS,
  APPLY_FILTER_SORT,
  MODIFY_DEMO_PRODUCT,
  FETCH_NEW_ARRIVAL_DEMO_PRODUCT_REQUEST,
  FETCH_NEW_ARRIVAL_DEMO_PRODUCT_SUCCESS,
  FETCH_NEW_ARRIVAL_DEMO_PRODUCT_FAILURE,
  MODIFY_FILTER_DEMO_PRODUCT,
  APPLY_RESET_FILTER_SORT,
  MODIFY_ALL_DEMO_PRODUCT,
  APPLY_FILTER_SORT_DEMO,
  APPLY_RESET_FILTER_SORT_PAGE_DEMO,
} from '../action/ActionTypes';

const initialProductState = {
  allProductsData: [],
  filteredProductsData: [],
  newArrivalProducts: [],
  currentPage: 1,
  totalPages: 1,
  visibleAllLength: 0,
  sortBy: 4,
  filterBy: 0,
  isLoading: false,
  loader: true,
  newArrivalIsLoading: true,
  error: null,
};

const demoProductReducer = (state = initialProductState, action) => {
  switch (action.type) {
    case FETCH_DEMO_PRODUCT_REQUEST:
      //  console.log(FETCH_DEMO_PRODUCT_REQUEST);
      return {
        ...state,
        isLoading: state.allProductsData.length === 0,
        loader: true,
        error: null,
      };
    case FETCH_DEMO_PRODUCT_SUCCESS:
      //  console.log(FETCH_DEMO_PRODUCT_SUCCESS);
      return {
        ...state,
        allProductsData: action.payload,
        filteredProductsData: applyPagination(
          {
            data: action.payload,
            sortBy: state.sortBy,
            filterBy: state.filterBy,
            callingFrom: 'FETCH_DEMO_PRODUCT_SUCCESS',
          },
          state.currentPage,
        ),
        totalPages: getTotalPage(action.payload),
        visibleAllLength: applyPagination(
          {
            data: action.payload,
            sortBy: state.sortBy,
            filterBy: state.filterBy,
            callingFrom: 'FETCH_DEMO_PRODUCT_SUCCESS-LENGTH',
          },
          1,
          true,
        ),
        isLoading: false,
        loader: false,
      };
    case FETCH_DEMO_PRODUCT_FAILURE:
      //  console.log(FETCH_DEMO_PRODUCT_FAILURE);
      return {
        ...state,
        allProductsData: [],
        filteredProductsData: [],
        currentPage: 1,
        visibleAllLength: 0,
        isLoading: false,
        loader: false,
        error: action.payload,
      };

    case FETCH_NEW_ARRIVAL_DEMO_PRODUCT_REQUEST:
      //  console.log(FETCH_NEW_ARRIVAL_DEMO_PRODUCT_REQUEST);
      return {
        ...state,
        newArrivalIsLoading: state.newArrivalProducts.length === 0,
        error: null,
      };
    case FETCH_NEW_ARRIVAL_DEMO_PRODUCT_SUCCESS:
      //  console.log(FETCH_NEW_ARRIVAL_DEMO_PRODUCT_SUCCESS);
      return {
        ...state,
        newArrivalProducts: action.payload,
        newArrivalIsLoading: false,
      };
    case FETCH_NEW_ARRIVAL_DEMO_PRODUCT_FAILURE:
      //  console.log(FETCH_NEW_ARRIVAL_DEMO_PRODUCT_FAILURE);
      return {
        ...state,
        newArrivalProducts: [],
        newArrivalIsLoading: false,
        error: action.payload,
      };

    case MODIFY_DEMO_PRODUCT:
      //  console.log(MODIFY_DEMO_PRODUCT);
      return {
        ...state,
        filteredProductsData: applyPagination(
          {
            data: action.payload,
            sortBy: state.sortBy,
            filterBy: state.filterBy,
            callingFrom: 'MODIFY_DEMO_PRODUCT',
          },
          1,
        ),
        visibleAllLength: applyPagination(
          {
            data: action.payload,
            sortBy: state.sortBy,
            filterBy: state.filterBy,
            callingFrom: 'MODIFY_DEMO_PRODUCT-LENGTH',
          },
          1,
          true,
        ),
      };

    case MODIFY_FILTER_DEMO_PRODUCT:
      return {
        ...state,
        filteredProductsData: action.payload,
      };

    case MODIFY_ALL_DEMO_PRODUCT:
      return {
        ...state,
        allProductsData: action.payload,
      };

    case LOAD_MORE_DEMO_PRODUCTS:
      //  console.log(LOAD_MORE_DEMO_PRODUCTS, action.payload);
      action.payload.setIsLoadingMore(false);
      return {
        ...state,
        currentPage: setCurrentPage(
          state.totalPages,
          state.currentPage,
          action.payload.page,
        ),
        filteredProductsData: applyPagination(
          {
            data: state.allProductsData,
            filterBy: state.filterBy,
            sortBy: state.sortBy,
            callingFrom: 'LOAD_MORE_DEMO_PRODUCTS',
          },
          setCurrentPage(
            state.totalPages,
            state.currentPage,
            action.payload.page,
          ),
        ),
      };

    case APPLY_FILTER_SORT_DEMO:
      console.log(APPLY_FILTER_SORT_DEMO);
      return {
        ...state,
        sortBy: action.payload?.sortBy || 4,
        filterBy: action.payload?.filterBy || 0,
        currentPage: 1,
        filteredProductsData: applyPagination(
          {
            data: state.allProductsData,
            sortBy: action.payload?.sortBy || 4,
            filterBy: action.payload?.filterBy || 0,
            callingFrom: 'APPLY_FILTER_SORT_DEMO',
          },
          1,
        ),
        visibleAllLength: applyPagination(
          {
            data: state.allProductsData,
            sortBy: action.payload?.sortBy || 4,
            filterBy: action.payload?.filterBy || 0,
            callingFrom: 'APPLY_FILTER_SORT_DEMO-LENGTH',
          },
          1,
          true,
        ),
      };

    case APPLY_RESET_FILTER_SORT_PAGE_DEMO:
      return {
        ...state,
        currentPage: 1,
        sortBy: 4,
        filterBy: 0,
        filteredProductsData: applyPagination(
          {
            data: state.allProductsData,
            sortBy: 4,
            filterBy: 0,
            callingFrom: 'APPLY_RESET_FILTER_SORT_PAGE_DEMO',
          },
          1,
        ),
      };
    default:
      return state;
  }
};

export default demoProductReducer;

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
