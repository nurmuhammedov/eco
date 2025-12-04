import { UserState } from '@/entities/user'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState } from '@/entities/auth/models/auth.model'

const initialState: AuthState = {
  user: null,
  isAuthenticated: true,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
  },
})

export const { setUser } = authSlice.actions

export default authSlice.reducer
