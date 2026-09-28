import { xrayDetailApi } from '@/features/register/xray/model/xray-detail.api'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { useQuery } from '@tanstack/react-query'
import { toLabelledFiles } from '@/entities/application'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

export const useXrayDetail = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  return useQuery({
    queryKey: endpointKey('/xrays', id),
    enabled: !!id,
    queryFn: () => xrayDetailApi.getDetail(id),
    select: (data) => {
      const files = toLabelledFiles(data.files, (field) => t(`labels.XRAY.${field}`))
      return {
        ...data,
        files,
      }
    },
  })
}
