import { irsDetailApi } from '@/features/register/irs/model/irs-detail.api'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { useQuery } from '@tanstack/react-query'
import { toLabelledFiles } from '@/entities/application'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

export const useIrsDetail = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  return useQuery({
    queryKey: endpointKey('/irs', id),
    enabled: !!id,
    queryFn: () => irsDetailApi.getDetail(id),
    select: (data) => {
      const files = toLabelledFiles(data.files, (field) => t(`labels.IRS.${field}`))
      return {
        ...data,
        files,
      }
    },
  })
}
