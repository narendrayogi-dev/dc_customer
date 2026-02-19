import {applyMiddleware} from 'redux';
import {configureStore} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../reducers';
import rootSaga from '../sagas';


import {persistStore, persistReducer} from 'redux-persist';

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['categories', 'auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
      immutableCheck: false,
    }).concat(sagaMiddleware),
});

const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export {store, persistor};

