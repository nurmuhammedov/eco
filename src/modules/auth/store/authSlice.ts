import type { AuthState, User } from '@/modules/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRoles } from '@/shared/types';

const initialState: AuthState = {
  user: {
    id: 1,
    email: 'admin@gmail.com',
    first_name: 'Admin',
    last_name: 'Adminov',
    permissions: ['all'],
    roles: [UserRoles.ADMIN],
  } as User,
  isAuthenticated: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
