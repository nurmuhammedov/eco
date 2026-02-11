import { FC } from 'react'
import { RiskAnalysisData } from '../riskAnalysis'
import { format } from 'date-fns'
import { cn } from '@/shared/lib/utils.ts'

interface Props {
  data: RiskAnalysisData | null
}

const RiskAnalysisInspectorInfo: FC<Props> = ({ data }) => {
  if (!data) {
    return <div className={'px-5 py-5'}>Maʼlumot mavjud emas!</div>
  }

  return (
    <div>
      <p className="flex items-center gap-2 px-2 py-3">
        <span className="text-neutral-500">Davr:</span>
        <span className={cn('font-medium')}>
          {data.startDate ? format(new Date(data.startDate), 'dd.MM.yyyy') : ''} -{' '}
          {data.endDate ? format(new Date(data.endDate), 'dd.MM.yyyy') : ''}
        </span>
      </p>
    </div>
  )
}

export default RiskAnalysisInspectorInfo
