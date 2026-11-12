import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import type { ApiResponse } from '@/shared/types'
import { ApplicationStatus } from '@/entities/application'
import { isRestoreChange, type RegistryChange } from '@/entities/registry'
import { useAuth } from '@/shared/hooks/use-auth'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { DEFAULT_STALE_TIME } from '@/shared/lib/query/stale-time'

/**
 * The latest change request of a registry record, in any status (COMPLETED
 * included). A record that never had one answers 404, which here means "none"
 * rather than an error worth a toast.
 *
 * Keyed under '/changes/by-belong' so the change modals' invalidation reaches
 * it, but apart from useDetail's key there: that one treats the 404 as an error.
 */
export const useLastChange = (belongId: string | undefined, enabled: boolean) => {
  const { user } = useAuth()

  const query = useQuery<RegistryChange | null>({
    queryKey: endpointKey('/changes/by-belong', belongId, 'last', user?.role),
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<ApiResponse<RegistryChange | null>>(
          `/changes/by-belong/${belongId}`,
          undefined,
          undefined,
          undefined,
          { silentErrorStatuses: [404] }
        )

        return data?.data ?? null
      } catch (error) {
        // Only the 404 is kept quiet; the interceptor has reported anything else like for any other query
        if ((error as { status?: number }).status === 404) return null
        throw error
      }
    },
    enabled: enabled && !!belongId,
    staleTime: DEFAULT_STALE_TIME,
  })

  const lastChange = query.data ?? null
  const isRestore = isRestoreChange(lastChange?.belongType)

  return {
    lastChange,
    /** The answer is in: until then no restore action is offered */
    isResolved: query.isSuccess,
    restoreInApproval: isRestore && lastChange?.status === ApplicationStatus.IN_APPROVAL,
    restoreReturned: isRestore && lastChange?.status === ApplicationStatus.IN_PROCESS,
    /** Any unfinished request blocks a new restore on the backend */
    hasOpenChange: !!lastChange && lastChange.status !== ApplicationStatus.COMPLETED,
  }
}
