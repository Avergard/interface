import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import goodsReducer from './slices/goodsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    goods: goodsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 