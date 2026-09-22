import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { endpointKey, invalidateEndpoint } from '@/shared/lib/query/endpoint-key'
import {
  APPROVERS_ENDPOINT,
  CANDIDATES_ENDPOINT,
  kpiApproversAPI,
  type SaveKpiApproversDTO,
} from '../api/kpi-approvers.api'

export const useKpiApprovers = () =>
  useQuery({
    queryKey: endpointKey(APPROVERS_ENDPOINT),
    queryFn: kpiApproversAPI.getAll,
  })

export const useKpiApproverCandidates = () =>
  useQuery({
    queryKey: endpointKey(CANDIDATES_ENDPOINT),
    queryFn: kpiApproversAPI.getCandidates,
    staleTime: 5 * 60 * 1000,
  })

export const useSaveKpiApprovers = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SaveKpiApproversDTO) => kpiApproversAPI.save(data),
    onSuccess: async () => {
      await invalidateEndpoint(queryClient, APPROVERS_ENDPOINT)
      // Whoever is looking at KPI right now may have just gained or lost the
      // pages, and the menu is built from that answer.
      await invalidateEndpoint(queryClient, '/kpi/me')
      toast.success('Tasdiqlovchilar saqlandi.')
    },
  })
}
