import { useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CommonService } from '@/shared/api/dictionaries/queries/comon.api'
import useData from '@/shared/hooks/api/useData'
import { CadastrePassport, WorkflowHistoryEntry } from './types'

export const CADASTRE_PASSPORT_KEY = 'cadastre-passports'

export const useCadastrePassport = (id?: string) =>
  useQuery({
    queryKey: [CADASTRE_PASSPORT_KEY, id],
    queryFn: () => CommonService.getData<CadastrePassport>(`/cadastre-passports/${id}`),
    enabled: !!id,
    retry: false,
  })

export const useWorkflowHistory = (instanceId: string, enabled = true) =>
  useData<WorkflowHistoryEntry[]>(`/workflow-instances/${instanceId}/history`, enabled && !!instanceId)

export const useRefreshPassport = () => {
  const queryClient = useQueryClient()

  return useCallback(
    () =>
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => {
          const head = String(queryKey[0])

          return (
            head === CADASTRE_PASSPORT_KEY ||
            head.startsWith('/cadastre-passports') ||
            head.startsWith('/workflow-instances')
          )
        },
      }),
    [queryClient]
  )
}
