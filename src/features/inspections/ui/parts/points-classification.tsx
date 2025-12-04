import { riskAnalysisData } from '@/shared/constants/risk-analysis-data.ts'
import useCustomSearchParams from '../../../../shared/hooks/api/useSearchParams.ts'
import { useRiskAnalysisDetail } from '@/features/risk-analysis/hooks/use-risk-analysis-detail.ts'
import FileLink from '@/shared/components/common/file-link.tsx'
import { Button } from '@/shared/components/ui/button.tsx'
import { Check, Minus } from 'lucide-react'
import { clsx } from 'clsx'
import { Badge } from '@/shared/components/ui/badge.tsx'

const PointsClassification = () => {
  const { paramsObject } = useCustomSearchParams()
  const currentCat = paramsObject?.type || ''
  const { data, isLoading, isError } = useRiskAnalysisDetail()
  const totalScore = data?.reduce((sum: any, item: any) => sum + (item.score ?? 0), 0) || 0

  if (isLoading || isError) {
    return null
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Badge variant="destructive">Jami ballar: {totalScore}</Badge>
      </div>
      {/*@ts-ignore*/}
      {riskAnalysisData[currentCat] &&
        //@ts-ignore
        riskAnalysisData[currentCat].map((item, idx) => {
          const paragraphName = `PARAGRAPH_${currentCat?.toUpperCase()}_${idx + 1}`
          const currentItem = data?.find((item: any) => item.indicatorType === paragraphName)
          const isInvalid = currentItem && currentItem?.score !== 0
          return (
            <div key={item.title}>
              <div
                className={clsx('rounded bg-[#EDEEEE] p-2.5 font-medium shadow-md', {
                  'bg-red-200': isInvalid,
                  'bg-green-200': !isInvalid,
                })}
              >
                {idx + 1}. {item.title} - <b>{item.point}</b> ball
              </div>
              <div
                className={clsx('my-2 flex items-center gap-4 px-2.5 py-5', {
                  'bg-red-50': isInvalid,
                  'bg-green-50': !isInvalid,
                })}
              >
                <div className="flex-grow">{item.title}</div>
                <div className="flex w-full max-w-[600px] flex-shrink-0 items-center gap-3">
                  <div className="flex flex-shrink-0 gap-1">
                    {!isInvalid && (
                      <Button type="button" className="flex-shrink-0" variant="success" size="icon">
                        <Check />
                      </Button>
                    )}

                    {isInvalid && (
                      <Button type="button" className="flex-shrink-0" variant={'destructive'} size="icon">
                        <Minus />
                      </Button>
                    )}
                  </div>
                  <p className="min-h-[120px] w-full rounded border bg-neutral-50 p-4 text-sm">
                    {currentItem?.description}
                  </p>
                  {!!currentItem?.filePath && (
                    <FileLink isSmall={true} title={'Ma’lumotnoma'} url={currentItem?.filePath} />
                  )}
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default PointsClassification
