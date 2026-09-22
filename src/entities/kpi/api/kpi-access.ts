import { useQuery } from '@tanstack/react-query'
import { servicesApiClient } from '@/shared/api/services-api-client'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/shared/types/user'

const ENDPOINT = '/kpi/me'

export interface KpiAccess {
  /** One of the two people who sign off on results. */
  is_approver: boolean
  /** The one of them who also draws up the tasks - the duty HR used to hold. */
  can_assign: boolean
}

const NO_ACCESS: KpiAccess = { is_approver: false, can_assign: false }

/**
 * Who may approve is a list of two named people, not a role, so the router
 * cannot decide it: both of them sign in as an ordinary `HEAD`. The pages ask
 * the server instead. The server enforces it either way - this only decides
 * what is worth drawing.
 */
export const useKpiAccess = () => {
  const { user } = useAuth()
  const enabled = !!user && [UserRoles.HEAD, UserRoles.CHAIRMAN, UserRoles.PROCURATOR].includes(user.role)

  const query = useQuery({
    queryKey: endpointKey(ENDPOINT, user?.id),
    queryFn: async () => {
      const response = await servicesApiClient.get<KpiAccess>(ENDPOINT)
      // The services API wraps its payload one level deeper than the main one.
      const payload = response.data as unknown as { data?: KpiAccess }

      return payload?.data ?? (payload as KpiAccess)
    },
    enabled,
    staleTime: Infinity,
  })

  return {
    access: query.data ?? NO_ACCESS,
    isLoading: enabled && query.isPending,
  }
}
