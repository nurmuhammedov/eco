import { UserRoles } from '@/entities/user'
import { useAuth } from '@/shared/hooks/use-auth'

export const useCurrentRole = () => {
  const { user } = useAuth()
  return user?.role || UserRoles.LEGAL
}
