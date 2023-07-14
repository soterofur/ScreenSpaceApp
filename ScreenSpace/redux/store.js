import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cinemaReducer from './reducers/cinemaReducer';
import userReducer from './reducers/userReducer';

const reducers = combineReducers({
  user: userReducer,
  cinemas: cinemaReducer,
});
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
  reducer: persistedReducer,
  middleware: [
    ...getDefaultMiddleware({immutableCheck: false, serializableCheck: false}),
  ],
});
