import { configureStore } from '@reduxjs/toolkit'
import web3Reducer from './slices/web3Slice'
import userReducer from './slices/userSlices'

export const store = configureStore({
  reducer: {
    web3: web3Reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})