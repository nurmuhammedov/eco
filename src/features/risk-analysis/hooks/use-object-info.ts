import { useQuery } from '@tanstack/react-query'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { riskAnalysisDetailApi } from '@/features/risk-analysis/model/risk-analysis-detail.api'

export const useObjectInfo = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  let currentType = searchParams.get('type') || ''
  const currentId = searchParams.get('id') || ''

  const isRadProfile = currentType === 'IRS' || currentType === 'XRAY'

  if (currentType !== 'HF' && currentType !== 'IRS' && currentType !== 'XRAY') {
    currentType = 'equipments'
  }

  return useQuery({
    queryKey: endpointKey(`/${currentType.toLowerCase()}`, currentId),
    enabled: !!currentId && !isRadProfile,
    queryFn: () => riskAnalysisDetailApi.getObjectInfo({ type: currentType?.toLowerCase(), id: currentId }),
    select: (data) => {
      const fileNamePrefix = currentType !== 'equipments' ? currentType.toUpperCase() : data.type

      const files = Object.entries(data?.files)
        .filter(([label, value]) => label.includes('Path') && !!value)
        .map((file) => {
          const label = `labels.${fileNamePrefix}.${file[0]}`
          return { label: t(label), data: file[1] }
        })
      return {
        ...data,
        files,
      }
    },
  })
}
