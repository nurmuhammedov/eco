// src/features/application/application-detail/model/use-application-detail.tsx
import { QK_APPLICATIONS } from '@/shared/constants/query-keys.ts'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { applicationDetailApi } from '../model/application-detail.api.ts'

export const useApplicationDetail = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  return useQuery({
    queryKey: [QK_APPLICATIONS, id],
    enabled: !!id,
    queryFn: () => applicationDetailApi.getApplicationDetail(id),
    select: (data) => {
      const files = Object.entries(data.data?.files || [])
        .filter(([key]) => key.includes('Path'))
        .map(([key, value]) => {
          const label = `labels.${data?.appealType?.replace('DEREGISTER_', '')?.replace('REGISTER_', '')?.replace('RE_', '')}.${key}`
          return { label: t(label), data: value as string, fieldName: key }
        })
      return {
        ...data,
        files,
      }
    },
  })
}
