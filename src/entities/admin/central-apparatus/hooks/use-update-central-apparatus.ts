import { centralApparatusAPI } from '../model/central-apparatus.api'
import { centralApparatusKeys } from '../model/central-apparatus.query-keys'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { useSliceMutation } from '@/shared/lib/query/use-slice-mutation'

export const useUpdateCentralApparatus = () =>
  useSliceMutation(centralApparatusAPI.update, centralApparatusKeys.root(), [API_ENDPOINTS.DEPARTMENTS])
