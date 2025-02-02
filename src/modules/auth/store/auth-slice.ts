import { UserRoles } from '@/shared/types';
import type { AuthState } from '@/modules/auth';
import type { AuthUser } from '@/modules/auth/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: AuthState = {
  isAuthenticated: true,
  user: {
    id: 1,
    email: 'admin@gmail.com',
    first_name: 'Admin',
    last_name: 'Adminov',
    permissions: ['all'],
    role: UserRoles.USER,
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
