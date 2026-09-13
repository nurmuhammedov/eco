import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiClient } from '@/shared/api/api-client'
import { CommonService } from '@/shared/api/dictionaries/queries/comon.api'
import { OrgPosition, PartnerOrg, ProcessParticipant, WorkflowDefinition } from '../model/types'

const KEY = 'org-workflow'

export const usePartnerOrgs = () =>
  useQuery({
    queryKey: [KEY, 'partner-orgs'],
    queryFn: () => CommonService.getData<PartnerOrg[]>('/partner-orgs'),
  })

export const useOrgPositions = (orgId?: string) =>
  useQuery({
    queryKey: [KEY, 'positions', orgId],
    queryFn: () => CommonService.getData<OrgPosition[]>('/org-positions', { orgId }),
    enabled: !!orgId,
  })

export const useWorkflowDefinitions = (orgId?: string) =>
  useQuery({
    queryKey: [KEY, 'definitions', orgId],
    queryFn: () => CommonService.getData<WorkflowDefinition[]>('/workflow-definitions', { orgId }),
    enabled: !!orgId,
  })

export const useProcessParticipants = () =>
  useQuery({
    queryKey: [KEY, 'participants'],
    queryFn: () => CommonService.getData<ProcessParticipant[]>('/process-participants'),
  })

interface OrgWorkflowRequest {
  method: 'post' | 'put'
  url: string
  body?: object
  success: string
}

export const useOrgWorkflowMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ method, url, body }: OrgWorkflowRequest) =>
      method === 'post' ? apiClient.post(url, body ?? {}) : apiClient.put(url, body ?? {}),
    onSuccess: (_response, { success }) => {
      toast.success(success)

      return queryClient.invalidateQueries({
        predicate: ({ queryKey }) => {
          const head = String(queryKey[0])

          return head === KEY || head.startsWith('/org-employees')
        },
      })
    },
  })
}
