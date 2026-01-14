import { FC } from 'react'
import { RiskAnalysisData } from '../riskAnalysis'
import { format } from 'date-fns'
import { cn } from '@/shared/lib/utils.ts'

interface Props {
  data: RiskAnalysisData | null
}

const RiskAnalysisInspectorInfo: FC<Props> = ({ data }) => {
  if (!data) {
    return <div className={'px-5 py-5'}>Ma'lumot mavjud emas</div>
  }

  return (
    <div>
      {/*<p className="flex items-center gap-2 border-b-neutral-100 border-b px-2 py-3">*/}
      {/*  <span className="text-neutral-500">Belgilangan inspektor F.I.SH.:</span>*/}
      {/*  <span className="font-medium">{data.inspectorName || 'Kiritilmagan'}</span>*/}
      {/*</p>*/}
      {/*<p className="flex items-center gap-2 border-b border-b-neutral-100 px-2 py-3">*/}
      {/*  <span className="text-neutral-500">Inspektor belgilangan sana:</span>*/}
      {/*  <span className="font-medium">*/}
      {/*    {data.assignedDate ? format(new Date(data.assignedDate), 'dd.MM.yyyy, HH:mm') : 'Kiritilmagan'}*/}
      {/*  </span>*/}
      {/*</p>*/}
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
