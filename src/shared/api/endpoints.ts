export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  USERS: '/users',
};

export type ApiEndpoints = keyof typeof API_ENDPOINTS;
