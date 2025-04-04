import { UserRoles } from '@/entities/user';
import { useTranslation } from 'react-i18next';

export const getUserRoleDisplay = (
  role: UserRoles | string | null | undefined,
  includeOriginal: boolean = false,
  fallback: string = '',
): string => {
  const { t } = useTranslation('common');
  if (!role) {
    return fallback;
  }

  const isValidRole = Object.values(UserRoles).includes(role as UserRoles);

  if (!isValidRole) {
    return fallback;
  }

  const userRole = role as UserRoles;

  // Rol uchun tarjimani olish
  const translatedRole = t(`userRoles.${userRole}`, {
    defaultValue: fallback || userRole,
  });

  if (includeOriginal) {
    return `${translatedRole} (${userRole})`;
  }

  return translatedRole;
};
