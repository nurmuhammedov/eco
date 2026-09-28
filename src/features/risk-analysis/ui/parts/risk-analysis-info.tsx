import { Tabs } from '@/shared/components/ui/tabs'
import { FC, useState } from 'react'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/shared/types/user'
import RiskAnalysisInspectorInfo from '@/features/risk-analysis/ui/parts/risk-analysis-inspector-info'
import { Badge } from '@/shared/components/ui/badge'
import { RiskAnalysisData } from '../risk-analysis'
import RiskAnalysisForm from '@/features/risk-analysis/ui/parts/risk-analysis-form'
import useDetail from '@/shared/hooks/api/use-detail'
import FormSkeleton from '@/shared/components/common/form-skeleton/ui'

interface RiskAnalysisIndicatorProps {
  riskAnalysisId?: string
}

const RiskAnalysisIndicator: FC<RiskAnalysisIndicatorProps> = ({ riskAnalysisId }) => {
  const { user } = useAuth()
  const isInspector = user?.role === UserRoles.INSPECTOR
  const [activeTab, setActiveTab] = useState(isInspector ? 'analysis_indicators' : 'inspector_info')

  const { data: analysisData, isLoading } = useDetail<RiskAnalysisData>('/risk-analyses', riskAnalysisId)

  const totalScore = analysisData?.totalScore || 0

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 py-2">
        <FormSkeleton length={4} />
      </div>
    )
  }

  if (!analysisData) return null

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex items-center justify-between">
        <div className="ml-auto flex items-center gap-4">
          <Badge variant={totalScore > 80 ? 'destructive' : 'success'}>Jami ballar: {totalScore}</Badge>
        </div>
      </div>
      <RiskAnalysisInspectorInfo data={analysisData} />
      <RiskAnalysisForm data={analysisData.indicators} />
    </Tabs>
  )
}

export default RiskAnalysisIndicator
