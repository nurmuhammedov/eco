import { GoBack } from '@/shared/components/common'
import { useCustomSearchParams } from '@/shared/hooks'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import RiskAnalysisIndicator from '@/features/risk-analysis/ui/parts/risk-analysis-info'
import { useParams } from 'react-router-dom'

const RiskAnalysisInfoById = () => {
  const {
    paramsObject: { tin, name },
  } = useCustomSearchParams()
  const { id } = useParams()

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <GoBack title={`Tashkilot: ${name || ''} ${tin ? `(${tin})` : ''}`} />
      </div>
      <DetailCardAccordion defaultValue={['risk_anlalysis_info']}>
        <DetailCardAccordion.Item value="risk_anlalysis_info" title="Xavfni tahlil qilish bo‘yicha ma’lumotlar">
          <RiskAnalysisIndicator belongId={id} />
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </>
  )
}

export default RiskAnalysisInfoById
