export const USER_PATTERNS = {
  pin: /^\d{14}$/,
  phone: /^\+998\d{9}$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
} as const;
