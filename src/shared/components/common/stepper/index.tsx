import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'

interface Props {
  steps: string[]
  namespace?: string
  activeStep: string
}

const Stepper: FC<Props> = ({ namespace = 'application_status', activeStep, steps }) => {
  const { t } = useTranslation()
  const currentStep = steps.indexOf(activeStep)
  return (
    <div className="flex w-full max-w-3xl items-center justify-between">
      {steps.map((step, index) => {
        const isActive = index === currentStep
        const isCompleted = index < currentStep

        return (
          <div key={index} className="relative flex flex-1 flex-col">
            {index < steps.length - 1 && (
              <div
                className={clsx('absolute top-[7px] left-0 z-0 h-0.5 w-full', {
                  'bg-[#E5E7EB]': !isCompleted,
                  'bg-[#016B7B]': isCompleted,
                })}
              />
            )}
            <div
              className={clsx('relative z-10 h-4 w-4 rounded-full border-1', {
                'border-[#016B7B] bg-[#016B7B]': isActive || isCompleted,
                'border-[#E5E7EB] bg-[#E5E7EB]': !isActive && !isCompleted,
              })}
            />
            <span className="absolute top-2.5 -left-1 mt-2 text-center text-xs whitespace-nowrap">
              {t(`${namespace}.${step}`)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default Stepper
