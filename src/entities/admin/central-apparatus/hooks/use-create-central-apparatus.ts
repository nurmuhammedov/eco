import { centralApparatusAPI } from '../model/central-apparatus.api'
import { centralApparatusKeys } from '../model/central-apparatus.query-keys'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { useSliceMutation } from '@/shared/lib/query/use-slice-mutation'

export const useCreateCentralApparatus = () =>
  useSliceMutation(centralApparatusAPI.create, centralApparatusKeys.root(), [API_ENDPOINTS.DEPARTMENTS])
