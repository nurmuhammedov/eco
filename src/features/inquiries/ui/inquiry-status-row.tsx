import Stepper from '@/shared/components/common/stepper'
import { cn } from '@/shared/lib/utils'
import { InquiryStatus, type InquiryType } from '@/features/inquiries/model/types'
import DetailRow from '@/shared/components/common/detail-row'

interface Props {
  status: InquiryStatus | null
  type?: InquiryType | null
  title?: string
}

export const InquiryStatusRow = ({ status, type, title = 'Holat:' }: Props) => {
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

  if (type === 'VIOLATION_REPORT') {
    steps = [
      InquiryStatus.NEW,
      InquiryStatus.IN_PROCESS,
      InquiryStatus.UNDER_INSPECTION,
      InquiryStatus.IN_COURT,
      InquiryStatus.REWARD_PAYMENT,
      InquiryStatus.COMPLETED,
    ]
  } else if (type) {
    steps = [InquiryStatus.NEW, InquiryStatus.IN_PROCESS, InquiryStatus.COMPLETED]
  }

  return (
    <div className="grid grid-cols-1 gap-2 rounded-md py-2 pr-6 pl-2 odd:bg-neutral-50 sm:grid-cols-2 sm:gap-4">
      <span className="self-center text-sm font-medium text-gray-500">{title}</span>
      <div className="py-2 pb-4">
        <Stepper size="sm" activeStep={status ?? ''} steps={steps} namespace="inquiry_status" />
      </div>
    </div>
  )
}
