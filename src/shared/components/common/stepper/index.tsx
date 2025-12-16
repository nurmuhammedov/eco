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
  const labelTop = isSmall ? 'top-7' : 'top-10'
  const labelTextSize = isSmall ? 'text-[10px]' : 'text-xs'

  return (
    <div className={cn('flex w-full items-center justify-between', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex
        const isActive = index === currentIndex
        const isLast = index === steps.length - 1

        return (
          <Fragment key={step}>
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  'flex items-center justify-center rounded-full border-2 transition-all duration-300',
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
                  'absolute left-1/2 w-32 -translate-x-1/2 text-center font-medium transition-colors duration-300',
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
                className={cn('mx-1 h-[2px] flex-1 transition-colors duration-300', {
                  'bg-[#016B7B]': isCompleted,
                  'bg-gray-200': !isCompleted,
                })}
              />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

export default Stepper
