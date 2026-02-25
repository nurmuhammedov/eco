import { FC } from 'react'
import { clsx } from 'clsx'
import { Indicator } from '../riskAnalysis'

interface Props {
  number: string
  data: Indicator
  displayIndex: number
  info?: boolean
}

const statusMap: Record<string, string> = {
  UPLOADED: 'Tadbirkor tomonidan ijro uchun fayl yuklangan',
  REJECTED: 'Inspektor tomonidan rad etilgan',
  EXISTING: 'Reyestrda ushbu fayl mavjud',
  COMPLETED: 'Inspektor tomonidan qabul qilingan',
  EXPIRED: "Faylning amal qilish muddati o'tgan",
  NOT_EXISTING: 'Reyestrda ushbu fayl mavjud emas',
  NOT_EXPIRY_DATE: 'Faylning amal qilish muddati kiritilmagan',
}

const RiskAnalysisItem: FC<Props> = ({ data, displayIndex }) => {
  const isConfirmed = data?.score === 0
  let statusText: string | null = null

  if (data?.status) {
    if (data.score > 0) {
      statusText = statusMap[data.status]
    }
  }

  return (
    <div key={data.text}>
      <div
        className={clsx('rounded bg-[#EDEEEE] p-2.5 font-medium shadow-md', {
          'bg-red-200': !!data?.score && data?.score > 0,
          'bg-green-200': isConfirmed,
        })}
      >
        <div className="flex justify-between gap-2">
          <div>
            {displayIndex}. {data.text} - <b>{data.maxScore}</b> ball
          </div>
          {data?.score == 0 ? (
            <div className="pr-4">
              <b>0</b> ball
            </div>
          ) : (
            <div className="pr-4">
              <b>{data?.score}</b> ball
            </div>
          )}
        </div>
      </div>
      <div
        className={clsx('my-2 flex items-center gap-4 px-2.5 py-5', {
          'bg-red-50': !!data?.score && data?.score > 0,
          'bg-green-50': isConfirmed,
        })}
      >
        <div className="flex flex-grow flex-col">
          <span>{data.text}</span>
          {statusText && <span className={clsx('mt-1 text-sm font-semibold italic')}>* {statusText}</span>}
        </div>
      </div>
    </div>
  )
}

export default RiskAnalysisItem
