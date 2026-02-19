import {combineReducers} from '@reduxjs/toolkit';
import storesReducer from './storeReducer';
import productReducer from './productReducer';
import categoryReducer from './categoryReducer';
import profileReducer from './profileReducer';
import wishlistReducer from './wishlistReducer';
import notificationReducer from './notificationReducer';
import homeReducer from './homeReducer';
import routeReducer from './routeReducer';
import orderReducer from './orderReducer';
import networkReducer from './networkReducer';
import demoHomeReducer from './demoHomeReducer';
import demoProductReducer from './demoProductReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
  store: storesReducer,
  product: productReducer,
  demoProduct: demoProductReducer,
  category: categoryReducer,
  profile: profileReducer,
  wishlist: wishlistReducer,
  notification: notificationReducer,
  home: homeReducer,
  route: routeReducer,
  order: orderReducer,
  demoHome: demoHomeReducer,
  network: networkReducer,
  auth: authReducer,
});

export default rootReducer;
