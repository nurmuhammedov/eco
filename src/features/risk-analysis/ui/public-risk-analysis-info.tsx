import RiskAnalysisItem from '@/features/risk-analysis/ui/parts/risk-analysis-item.tsx'
import { FC } from 'react'
import { RiskAnalysisData, RiskIndicators } from '@/features/risk-analysis/ui/riskAnalysis.ts'
import { useParams } from 'react-router-dom'
import { useDetail } from '@/shared/hooks'
import { Loader2 } from 'lucide-react'
import RiskAnalysisInspectorInfo from '@/features/risk-analysis/ui/parts/risk-analysis-inspector-info.tsx'

interface Props {
  data: RiskIndicators | null
}

const PublicRiskAnalysisInfo: FC<Props> = () => {
  const { id } = useParams()
  const { data, isLoading: isDetailLoading } = useDetail<RiskAnalysisData>(`/public/risk-analyses/`, id, !!id)

  if (isDetailLoading) {
    return (
      <div className="flex min-h-[300px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!data?.indicators || Object.keys(data?.indicators).length === 0) {
    return (
      <div className="text-muted-foreground mx-auto w-full max-w-4xl p-6 text-center">
        <p>Ushbu ID bo‘yicha maʼlumotlar topilmadi.</p>
      </div>
    )
  }

  const indicatorsArray = Object.entries(data?.indicators)

  return (
    <div className="p-4">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-4 pt-0 shadow">
        <RiskAnalysisInspectorInfo data={data} />
        <div>
          {indicatorsArray.map(([key, indicatorData], idx) => {
            return <RiskAnalysisItem key={key} number={key} data={indicatorData} displayIndex={idx + 1} />
          })}
        </div>
      </div>
    </div>
  )
}

export default PublicRiskAnalysisInfo
