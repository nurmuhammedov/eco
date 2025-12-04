import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import { GoBack } from '@/shared/components/common'
import { useSearchParams } from 'react-router-dom'
import { useObjectInfo } from '@/features/risk-analysis/hooks/use-object-info.ts'
import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info.tsx'
import PointsClassification from '@/features/inspections/ui/parts/points-classification.tsx'

const InspectionsDetail = () => {
  const { data } = useObjectInfo()
  const [searchParams] = useSearchParams()
  const currentTin = searchParams.get('tin')
  let type = searchParams.get('type') || ''

  if (type !== 'hf' && type !== 'irs') {
    type = data?.type
  }

  if (!data) {
    return null
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <GoBack title={`Tashkilot STIR: ${currentTin}`} />
      </div>
      <DetailCardAccordion defaultValue={['org_info', 'object_info', 'risk_analysis_info']}>
        <DetailCardAccordion.Item value="object_info" title="Obyekt yoki qurilma to‘g‘risida ma’lumot">
          <AppealMainInfo data={data} type={type?.toUpperCase()} address={data?.address} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="risk_analysis_info" title="Olingan ballar tasnifi">
          <PointsClassification />
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </>
  )
}

export default InspectionsDetail
