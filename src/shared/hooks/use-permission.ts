import { useAuth } from '@/shared/hooks/use-auth';

// Foydalanuvchi permissionlarini olish
export const useUserPermissions = (): string[] => {
  const { user } = useAuth();
  return user?.directions || [];
};

// Bitta permission mavjudligini tekshirish
export const useHasPermission = (permissionKey: string): boolean => {
  const permissions = useUserPermissions();
  return permissions?.some((p) => p === permissionKey) || false;
};

// Bir nechta permissionlardan birortasi borligini tekshirish (OR)
export const useHasAnyPermission = (permissionCodes: string[]): boolean => {
  const permissions = useUserPermissions();
  return permissionCodes.some((code) => permissions.some((permission) => permission === code));
};

// Bir nechta permissionlarning hammasi borligini tekshirish (AND)
export const useHasAllPermissions = (permissionCodes: string[]): boolean => {
  const permissions = useUserPermissions();
  return permissionCodes.every((code) => permissions.some((permission) => permission === code));
};
