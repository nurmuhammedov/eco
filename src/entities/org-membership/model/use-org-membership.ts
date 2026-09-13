import { useQuery } from '@tanstack/react-query'
import { useCurrentUser } from '@/entities/auth'
import { UserRoles } from '@/entities/user'
import { CommonService } from '@/shared/api/dictionaries/queries/comon.api'

export interface OrgMembership {
  employeeId: string
  orgId: string
  orgCode: string
  orgName: string
  positionId: string
  positionCode: string
  positionName: string
}

export const ORG_MEMBERSHIP_QUERY_KEY = ['org-employees', 'me'] as const

// Only an individual can be a partner organisation's employee.
export const useOrgMembership = () => {
  const { user } = useCurrentUser()
  const enabled = user?.role === UserRoles.INDIVIDUAL

  const { data, isPending } = useQuery({
    queryKey: [...ORG_MEMBERSHIP_QUERY_KEY, user?.id],
    queryFn: () => CommonService.getData<OrgMembership | null>('/org-employees/me'),
    enabled,
    staleTime: Infinity,
  })

  return {
    membership: enabled ? (data ?? null) : null,
    isLoading: enabled && isPending,
  }
}
