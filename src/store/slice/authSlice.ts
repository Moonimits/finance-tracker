import type { User } from "@/types/authTypes"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type UserState = {
  authUser: User | null
  loading: boolean
}

const initialState: UserState = {
  authUser: null,
  loading: true,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<User | null>) => {
      state.authUser = action.payload
      state.loading = false
    },
    logout: (state) => {
      state.authUser = null
    },
  },
})

export const { setAuth } = authSlice.actions
export default authSlice.reducer
