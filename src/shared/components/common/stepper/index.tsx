import { FC, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface StepperProps {
  steps: string[]
  activeStep: string
  namespace?: string
  className?: string
  size?: 'sm' | 'md'
}

const Stepper: FC<StepperProps> = ({ steps, activeStep, namespace = 'application_status', className, size = 'md' }) => {
  const { t } = useTranslation()
  const currentIndex = steps.indexOf(activeStep)

  const isSmall = size === 'sm'
  const circleSize = isSmall ? 'size-6' : 'size-8'
  const iconSize = isSmall ? 12 : 16
  const labelTop = isSmall ? 'lg:top-7' : 'lg:top-10'
  const labelTextSize = isSmall ? 'text-[10px]' : 'text-xs'
  const lineMarginLeft = isSmall ? 'ml-[11px]' : 'ml-[15px]'

  return (
    <div
      className={cn(
        'flex w-full flex-col items-start justify-between gap-1 lg:flex-row lg:items-center lg:gap-0',
        className
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex
        const isActive = index === currentIndex
        const isLast = index === steps.length - 1

        return (
          <Fragment key={step}>
            <div className="relative flex w-full flex-row items-center lg:w-auto lg:flex-col">
              <div
                className={cn(
                  'flex shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300',
                  circleSize,
                  {
                    'border-[#016B7B] bg-[#016B7B] text-white': isCompleted || isActive,
                    'border-gray-300 bg-white text-gray-300': !isActive && !isCompleted,
                  }
                )}
              >
                {isCompleted ? (
                  <Check size={iconSize} strokeWidth={3} />
                ) : (
                  <div
                    className={cn('rounded-full bg-current', isSmall ? 'size-1.5' : 'size-2.5', {
                      'opacity-0': !isActive,
                    })}
                  />
                )}
              </div>

              <span
                className={cn(
                  'ml-3 text-left font-medium transition-colors duration-300 lg:absolute lg:left-1/2 lg:ml-0 lg:w-32 lg:-translate-x-1/2 lg:text-center',
                  labelTop,
                  labelTextSize,
                  {
                    'text-[#016B7B]': isActive || isCompleted,
                    'text-gray-400': !isActive && !isCompleted,
                  }
                )}
              >
                {t(`${namespace}.${step}`)}
              </span>
            </div>

            {!isLast && (
              <div
                className={cn(
                  'transition-colors duration-300',
                  'my-1 h-6 w-[2px] lg:mx-1 lg:my-0 lg:h-[2px] lg:w-auto lg:flex-1',
                  lineMarginLeft,
                  'lg:ml-0',
                  {
                    'bg-[#016B7B]': isCompleted,
                    'bg-gray-200': !isCompleted,
                  }
                )}
              />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

export default Stepper
