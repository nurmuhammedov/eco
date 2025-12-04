import FileLink from '@/shared/components/common/file-link.tsx'
import { useSearchParams } from 'react-router-dom'
import { riskAnalysisData } from '@/shared/constants/risk-analysis-data.ts'
import { FC } from 'react'

const RiskAnalysisFilesToFix: FC<{ data: any }> = ({ data }) => {
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') || ''
  //@ts-ignore
  const currentData = riskAnalysisData[type] || []

  return (
    <div className="grid grid-cols-2 gap-x-8">
      {data.map((file: any) => {
        const currentIndex = file?.indicatorType.replace(/\D/g, '') - 1
        const title = currentData[currentIndex].title
        return (
          <div key={file.path} className="flex items-center justify-between border-b border-b-[#E5E7EB] px-3 py-4">
            <p>
              {currentIndex + 1}. {title}
            </p>
            <p className="shrink-0">
              <FileLink url={file.path} />
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default RiskAnalysisFilesToFix
