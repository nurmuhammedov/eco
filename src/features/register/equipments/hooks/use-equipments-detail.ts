import { equipmentsDetailApi } from '@/features/register/equipments/model/equipments-detail.api'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { useQuery } from '@tanstack/react-query'
import { toLabelledFiles } from '@/entities/application'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

export const useEquipmentsDetail = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  return useQuery({
    queryKey: endpointKey('/equipments', id),
    enabled: !!id,
    queryFn: () => equipmentsDetailApi.getDetail(id),
    select: (data) => {
      const files = toLabelledFiles(data.files, (field) => t(`labels.${data.type || 'HF'}.${field || 'file'}`))
      return {
        ...data,
        files,
      }
    },
  })
}
