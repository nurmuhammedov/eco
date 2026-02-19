import { Tabs } from '@/shared/components/ui/tabs.tsx'
import { FC, useEffect, useState } from 'react'
import { useAuth } from '@/shared/hooks/use-auth.ts'
import { UserRoles } from '@/entities/user'
import RiskAnalysisInspectorInfo from '@/features/risk-analysis/ui/parts/risk-analysis-inspector-info.tsx'
import { Badge } from '@/shared/components/ui/badge.tsx'
import { RiskAnalysisData } from '../riskAnalysis'
import { apiClient } from '@/shared/api/api-client'
import RiskAnalysisForm from '@/features/risk-analysis/ui/parts/risk-analysis-form'

interface RiskAnalysisIndicatorProps {
  belongId: any
}

const RiskAnalysisIndicator: FC<RiskAnalysisIndicatorProps> = ({ belongId }) => {
  const { user } = useAuth()
  const isInspector = user?.role === UserRoles.INSPECTOR
  const defaultTab = isInspector ? 'analysis_indicators' : 'inspector_info'
  const [activeTab, setActiveTab] = useState(defaultTab)

  const [analysisData, setAnalysisData] = useState<RiskAnalysisData | null>(null)
  const [isAnalysisLoading, setAnalysisLoading] = useState<boolean>(true)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  useEffect(() => {
    if (!belongId) {
      setAnalysisLoading(false)
      setAnalysisError('Kerakli parametrlar (belongId yoki intervalId) mavjud emas.')
      return
    }

    const fetchData = async () => {
      setAnalysisLoading(true)
      try {
        const url = `/risk-analyses/${belongId}`
        const response = await apiClient.get<{ data: RiskAnalysisData }>(url)
        setAnalysisData(response.data.data)
      } finally {
        setAnalysisLoading(false)
      }
    }

    void fetchData()
  }, [belongId])

  const totalScore = analysisData?.totalScore || 0

  if (isAnalysisLoading) {
    return <div>Yuklanmoqda...</div>
  }

  if (analysisError) {
    return <div>{analysisError || 'Maʼlumotlarni yuklashda xatolik.'}</div>
  }

  if (!analysisData) {
    return null
  }

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
