import Stepper from '@/shared/components/common/stepper'
import { cn } from '@/shared/lib/utils'
import { InquiryStatus } from '@/features/inquiries/model/types'
import DetailRow from '@/shared/components/common/detail-row'

interface Props {
  status: InquiryStatus | string
  title?: string
}

export const InquiryStatusRow = ({ status, title = 'Holat:' }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
  if (status === InquiryStatus.REJECTED) {
    return (
      <DetailRow title={title} value={<span className={cn('text-sm font-medium text-red-500')}>Rad etilgan</span>} />
    )
  }

  const steps = [
    InquiryStatus.NEW,
    InquiryStatus.IN_PROCESS,
    InquiryStatus.IN_COURT,
    InquiryStatus.REWARD_PAYMENT,
    InquiryStatus.COMPLETED,
  ]

  return (
    <DetailRow
      title={title}
      value={
        <div className="w-full py-1">
          <Stepper size="sm" activeStep={status} steps={steps} namespace="inquiry_status" />
        </div>
      }
    />
  )
}
