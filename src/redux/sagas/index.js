import {all} from 'redux-saga/effects';
import {watchFetchStores} from './storeSaga';
import {watchFetchProduct} from './productSaga';
import {watchFetchCategories} from './categorySaga';
import {watchFetchProfile} from './profileSaga';
import {watchFetchWishlist} from './wishlistSaga';
import {watchFetchNotification} from './notificationSaga';
import {watchFetchHome} from './homeSaga';
import {watchFetchOrder} from './orderSaga';
import {watchFetchDemo} from './demoSaga';
import {watchAuthSaga} from './authSaga'
// import { watchFetchUser } from './userSaga';

export default function* rootSaga() {
  yield all([
    watchFetchStores(),
    watchFetchProduct(),
    watchFetchCategories(),
    watchFetchProfile(),
    watchFetchWishlist(),
    watchFetchNotification(),
    watchFetchHome(),
    watchFetchOrder(),
    watchFetchDemo(),
    watchAuthSaga(),
  ]);
}
