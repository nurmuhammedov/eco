import { hfDetailApi } from '@/features/register/hf/model/hf-detail.api.ts'
import { QK_REGISTRY } from '@/shared/constants/query-keys.ts'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

export const useHfDetail = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  return useQuery({
    queryKey: [QK_REGISTRY, 'HF', id],
    enabled: !!id,
    queryFn: () => hfDetailApi.getDetail(id),
    select: (data) => {
      const toFileList = (set: Record<string, unknown> | undefined) =>
        Object.entries(set || {})
          .filter(([label]) => label.includes('Path'))
          .map(([key, value]) => ({ label: t(`labels.HF.${key || 'file'}`), data: value as string, fieldName: key }))

      /**
       * A multi-sector facility keeps one attachment set per category and leaves
       * the single set empty, so both are brought into the shape the sections
       * render.
       */
      const multiCategoryFiles = Object.fromEntries(
        Object.entries(data?.multiCategoryFiles || {}).map(([categoryId, set]) => [
          categoryId,
          toFileList(set as Record<string, unknown>),
        ])
      )

      return {
        ...data,
        files: toFileList(data?.files),
        multiCategoryFiles,
      }
    },
  })
}
