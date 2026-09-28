import { useQuery } from '@tanstack/react-query'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { riskAnalysisDetailApi } from '@/features/risk-analysis/model/risk-analysis-detail.api'
import { toLabelledFiles } from '@/entities/application'

/**
 * The registry record behind a risk analysis. Radiation sources and X-rays
 * are analysed per organisation, so for them the radiation profile is read
 * instead and this stays idle.
 */
export const useObjectInfo = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') || ''
  const id = searchParams.get('id') || ''

  const isRadProfile = type === 'IRS' || type === 'XRAY'
  const isHf = type === 'HF'
  const endpoint = isHf ? '/hf' : '/equipments'

  return useQuery({
    queryKey: endpointKey(endpoint, id),
    enabled: !!id && !isRadProfile,
    queryFn: () => riskAnalysisDetailApi.getObjectInfo({ endpoint, id }),
    select: (data) => {
      const labelPrefix = isHf ? 'HF' : 'type' in data ? data.type : ''
      return {
        ...data,
        files: toLabelledFiles(data.files, (field) => t(`labels.${labelPrefix}.${field}`)).filter(
          (file) => !!file.data
        ),
      }
    },
  })
}
