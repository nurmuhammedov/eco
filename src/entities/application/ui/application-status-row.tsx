import { ApplicationStatus } from '@/entities/application'
import Stepper from '@/shared/components/common/stepper'
import { cn } from '@/shared/lib/utils'

interface Props {
  status: ApplicationStatus
  title?: string
}

export const ApplicationStatusRow = ({ status, title = 'Ariza holati:' }: Props) => {
  if (status === ApplicationStatus.REJECTED || status === ApplicationStatus.CANCELED) {
    return (
      <div className="grid grid-cols-2 items-center gap-4 rounded-md px-2 py-1 odd:bg-neutral-50">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div
          className={cn('text-sm font-medium', status === ApplicationStatus.REJECTED ? 'text-red-800' : 'text-red-500')}
        >
          {status === ApplicationStatus.REJECTED ? 'Rad etilgan' : 'Qaytarilgan'}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-2 rounded-md py-2 pr-6 pl-2 odd:bg-neutral-50 sm:grid-cols-2 sm:gap-4">
      <span className="self-center text-sm font-medium text-gray-500">{title}</span>
      <div className="py-2 pb-4">
        <Stepper size="sm" activeStep={status} steps={Object.values(ApplicationStatus).slice(1, -2)} />
      </div>
    </div>
  )
}
