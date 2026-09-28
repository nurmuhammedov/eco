import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import type { AppealFile, ApplicationDetailWithFiles } from '@/entities/application'
import type { FileDto } from '@/shared/types'
import { applicationDetailApi } from '../model/application-detail.api'

export const useApplicationDetail = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  return useQuery({
    queryKey: endpointKey('/appeals', id),
    enabled: !!id,
    queryFn: () => applicationDetailApi.getApplicationDetail(id),
    select: (data): ApplicationDetailWithFiles => {
      const appealType = data?.appealType?.replace('DEREGISTER_', '')?.replace('REGISTER_', '')?.replace('RE_', '')

      const toFileList = (set?: Record<string, FileDto> | null): AppealFile[] =>
        Object.entries(set || {})
          .filter(([key]) => key.includes('Path'))
          .map(([key, value]) => ({ label: t(`labels.${appealType}.${key}`), data: value, fieldName: key }))

      /**
       * A multi-sector facility carries one attachment set per category instead
       * of a single one, both under the appeal payload. They are lifted to the
       * top level in the same shape the sections render.
       */
      const multiCategoryFiles = Object.fromEntries(
        Object.entries(data.data?.multiCategoryFiles || {}).map(([categoryId, set]) => [categoryId, toFileList(set)])
      )

      return {
        ...data,
        files: toFileList(data.data?.files),
        multiCategoryFiles,
      }
    },
  })
}
