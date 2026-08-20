import { Navigate } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/use-auth'
import { routeByRole } from '@/shared/lib/router/route-by-role'
import { useStartPath } from '@/widgets/sidebar/models/use-user-navigation'

/**
 * Sends the user to the first page their menu actually offers. The per-role default
 * is only used when the menu is still empty, which keeps users whose `directions`
 * exclude that default from landing on a not-found page.
 */
export default function StartRedirect() {
  const { user } = useAuth()
  const startPath = useStartPath()

  return <Navigate to={startPath ?? routeByRole(user?.role)} replace />
}
