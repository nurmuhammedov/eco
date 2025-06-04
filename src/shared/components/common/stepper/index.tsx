import {FC,} from "react";
import {useTranslation} from "react-i18next";
import {clsx} from "clsx";

interface Props {
    steps: string[]
    namespace?: string
    activeStep: string
}


const Stepper: FC<Props> = ({namespace = 'application_status', activeStep, steps}) => {
    const {t} = useTranslation()
    const currentStep = steps.indexOf(activeStep)
    return (
        <div className="flex items-center justify-between w-full max-w-3xl ">
            {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                    <div key={index} className="flex-1 flex flex-col   relative">
                        {index < steps.length - 1 && (
                            <div className={
                                clsx('absolute top-[7px] left-0 w-full h-0.5  z-0', {
                                    'bg-[#E5E7EB]': !isCompleted,
                                    'bg-[#016B7B]': isCompleted,
                                })
                            }/>
                        )}
                        <div
                            className={clsx('relative z-10 w-4 h-4 rounded-full border-1 ', {
                                'bg-[#016B7B] border-[#016B7B]': isActive || isCompleted,
                                'bg-[#E5E7EB] border-[#E5E7EB]': !isActive && !isCompleted
                            })}
                        />
                        <span className="mt-2 text-xs text-center whitespace-nowrap absolute top-2.5 -left-1">
              {t(`${namespace}.${step}`)}
            </span>
                    </div>
                );
            })}
        </div>
    );
};

export default Stepper;