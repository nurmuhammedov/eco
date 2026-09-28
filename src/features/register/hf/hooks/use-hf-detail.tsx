import { hfDetailApi } from '@/features/register/hf/model/hf-detail.api'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { useQuery } from '@tanstack/react-query'
import type { FileDto } from '@/shared/types'
import { toLabelledFiles } from '@/entities/application'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

export const useHfDetail = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  return useQuery({
    queryKey: endpointKey('/hf', id),
    enabled: !!id,
    queryFn: () => hfDetailApi.getDetail(id),
    select: (data) => {
      const toFileList = (set?: Record<string, FileDto> | null) =>
        toLabelledFiles(set, (field) => t(`labels.HF.${field || 'file'}`))

      /**
       * A multi-sector facility keeps one attachment set per category and leaves
       * the single set empty, so both are brought into the shape the sections
       * render.
       */
      const multiCategoryFiles = Object.fromEntries(
        Object.entries(data?.multiCategoryFiles || {}).map(([categoryId, set]) => [categoryId, toFileList(set)])
      )

      return {
        ...data,
        files: toFileList(data?.files),
        multiCategoryFiles,
      }
    },
  })
}
