import { irsDetailApi } from '@/features/register/irs/model/irs-detail.api.ts'
import { QK_REGISTRY } from '@/shared/constants/query-keys.ts'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

export const useIrsDetail = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  return useQuery({
    queryKey: [QK_REGISTRY, 'irs', id],
    enabled: !!id,
    queryFn: () => irsDetailApi.getDetail(id),
    select: (data) => {
      const files = Object.entries(data?.files)
        .filter(([label]) => label.includes('Path'))
        .map((file) => {
          const label = `labels.IRS.${file[0]}`
          return { label: t(label), data: file[1] }
        })
      return {
        ...data,
        files,
      }
    },
  })
}
