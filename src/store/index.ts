import { supabaseApi } from "@/store/api/supabaseApi"
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slice/authSlice"
import modalReducer from "./slice/modalSlice"
import daterangeReducer from "./slice/daterangeSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    daterange: daterangeReducer,
    [supabaseApi.reducerPath]: supabaseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(supabaseApi.middleware)
  },
})

export type Rootstate = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
