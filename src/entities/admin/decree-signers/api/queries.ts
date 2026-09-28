import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import type { DecreeSigner, DecreeSignersParams } from '../model/types'
import { DECREE_SIGNERS_KEYS } from './keys'

export const useDecreeSigners = (params: DecreeSignersParams) =>
  useQuery({
    queryKey: DECREE_SIGNERS_KEYS.list(params),
    queryFn: async () => (await apiClient.getWithPagination<DecreeSigner>('/decree-signers', params)).data,
  })
