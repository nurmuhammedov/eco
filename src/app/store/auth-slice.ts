import { UserRoles } from '@/shared/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthUser } from '@/entities/auth/models/auth.model';

const initialState: AuthState = {
  isAuthenticated: true,
  // user: null,
  user: {
    id: 1,
    email: 'admin@gmail.com',
    first_name: 'Admin',
    last_name: 'Adminov',
    permissions: ['all'],
    role: UserRoles.LEGAL,
  } as AuthUser,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
