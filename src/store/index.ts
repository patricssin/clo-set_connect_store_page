import { configureStore } from '@reduxjs/toolkit';
import contentSlice from './slices/contentSlice';
import filterReducer from './slices/filterSlice';

const store = configureStore({
  reducer: {
    content: contentSlice,
    filter: filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;