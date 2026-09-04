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
      const appealType = data?.appealType?.replace('DEREGISTER_', '')?.replace('REGISTER_', '')?.replace('RE_', '')

      const toFileList = (set: Record<string, unknown> | undefined) =>
        Object.entries(set || {})
          .filter(([key]) => key.includes('Path'))
          .map(([key, value]) => ({ label: t(`labels.${appealType}.${key}`), data: value as string, fieldName: key }))

      /**
       * A multi-sector facility carries one attachment set per category instead
       * of a single one, both under the appeal payload. They are lifted to the
       * top level in the same shape the sections render.
       */
      const multiCategoryFiles = Object.fromEntries(
        Object.entries(data.data?.multiCategoryFiles || {}).map(([categoryId, set]) => [
          categoryId,
          toFileList(set as Record<string, unknown>),
        ])
      )

      return {
        ...data,
        files: toFileList(data.data?.files),
        multiCategoryFiles,
      }
    },
  })
}
