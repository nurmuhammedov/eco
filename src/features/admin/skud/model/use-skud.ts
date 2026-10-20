import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { belongsToEndpoint, endpointKey, invalidateEndpoint } from '@/shared/lib/query/endpoint-key'
import {
  SKUD_DEVICES_ENDPOINT,
  SKUD_ENDPOINT,
  SKUD_PEOPLE_ENDPOINT,
  SKUD_REGIONS_ENDPOINT,
  SKUD_UNMATCHED_ENDPOINT,
  skudAPI,
  type SkudDeviceDTO,
  type SkudLinkDTO,
} from '../api/skud.api'

/**
 * Everything SKUD shows hangs off one prefix. The paged events list is keyed
 * as ['services', endpoint, …] by the shared hook, so it is matched by its
 * second part.
 */
const invalidateSkud = (queryClient: QueryClient) =>
  Promise.all([
    invalidateEndpoint(queryClient, SKUD_ENDPOINT),
    queryClient.invalidateQueries({
      predicate: ({ queryKey }) => queryKey[0] === 'services' && belongsToEndpoint(queryKey.slice(1), SKUD_ENDPOINT),
    }),
  ])

export const useSkudRegions = () =>
  useQuery({
    queryKey: endpointKey(SKUD_REGIONS_ENDPOINT),
    queryFn: skudAPI.getRegions,
  })

export const useSkudDevices = () =>
  useQuery({
    queryKey: endpointKey(SKUD_DEVICES_ENDPOINT),
    queryFn: skudAPI.getDevices,
  })

export const useSkudUnmatched = () =>
  useQuery({
    queryKey: endpointKey(SKUD_UNMATCHED_ENDPOINT),
    queryFn: skudAPI.getUnmatched,
  })

export const useSkudPeople = (enabled = true) =>
  useQuery({
    queryKey: endpointKey(SKUD_PEOPLE_ENDPOINT),
    queryFn: skudAPI.getPeople,
    staleTime: 5 * 60 * 1000,
    enabled,
  })

/** The server words its own outcome (e.g. "3 ta qurilma qo'shildi"); the fallback is for an empty body */
const serverMessage = (response: unknown) => (response as { data?: { message?: string } } | undefined)?.data?.message

const useSkudMutation = <TVariables>(mutationFn: (variables: TVariables) => Promise<unknown>, fallback: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: async (response) => {
      await invalidateSkud(queryClient)
      toast.success(serverMessage(response) ?? fallback)
    },
  })
}

export const useCreateSkudDevice = () =>
  useSkudMutation((data: SkudDeviceDTO) => skudAPI.createDevice(data), 'Qurilma qo‘shildi.')

export const useUpdateSkudDevice = () =>
  useSkudMutation(
    ({ id, data }: { id: string; data: Partial<SkudDeviceDTO> }) => skudAPI.updateDevice(id, data),
    'Qurilma yangilandi.'
  )

export const useDeleteSkudDevice = () =>
  useSkudMutation((id: string) => skudAPI.deleteDevice(id), 'Qurilma o‘chirildi.')

export const useRegenerateSkudToken = () =>
  useSkudMutation(
    (id: string) => skudAPI.regenerateToken(id),
    'Yangi manzil yaratildi. Qurilmadagi manzilni yangilang.'
  )

export const useSetupSkudDevices = () => useSkudMutation(() => skudAPI.setup(), 'Yetishmayotgan qurilmalar qo‘shildi.')

export const useLinkSkudPerson = () =>
  useSkudMutation((data: SkudLinkDTO) => skudAPI.link(data), 'Bog‘lanish saqlandi.')
