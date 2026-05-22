import Stepper from '@/shared/components/common/stepper'
import { cn } from '@/shared/lib/utils'
import { InquiryStatus } from '@/features/inquiries/model/types'
import DetailRow from '@/shared/components/common/detail-row'

interface Props {
  status: InquiryStatus | string
  type?: string
  title?: string
}

export const InquiryStatusRow = ({ status, type, title = 'Holat:' }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
  if (status === InquiryStatus.REJECTED) {
    return (
      <DetailRow title={title} value={<span className={cn('text-sm font-medium text-red-500')}>Rad etilgan</span>} />
    )
  }

  let steps = [
    InquiryStatus.NEW,
    InquiryStatus.IN_PROCESS,
    InquiryStatus.IN_COURT,
    InquiryStatus.REWARD_PAYMENT,
    InquiryStatus.COMPLETED,
  ]

  if (type && type !== 'RISK_APPEAL') {
    steps = [InquiryStatus.NEW, InquiryStatus.IN_PROCESS, InquiryStatus.COMPLETED]
  }

  return (
    <div className="grid grid-cols-1 gap-2 rounded-md py-2 pr-6 pl-2 odd:bg-neutral-50 sm:grid-cols-2 sm:gap-4">
      <span className="self-center text-sm font-medium text-gray-500">{title}</span>
      <div className="py-2 pb-4">
        <Stepper size="sm" activeStep={status} steps={steps} namespace="inquiry_status" />
      </div>
    </div>
  )
}
