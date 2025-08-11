import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api_slice';
import { setupListeners } from '@reduxjs/toolkit/query';
import { mediaSlice } from './media/media_slice';
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    mediaSlice: mediaSlice.reducer,
  },

  devTools: import.meta.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
