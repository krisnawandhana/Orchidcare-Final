// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import homepageReducer from './features/homepageSlice';

export const store = configureStore({
  reducer: {
    homepage: homepageReducer,
  },
});