import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { Undo2 } from 'lucide-react'

export const AppealReturnedMark = () => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex size-5 shrink-0 cursor-help items-center justify-center rounded-md border border-rose-200 bg-rose-50 text-rose-600">
            <Undo2 size={12} strokeWidth={2.5} />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-64">
          Ijro noto‘g‘ri bajarilgan deb qaytarilgan. Sababini ariza sahifasidagi «Javob hujjatlari» bo‘limidan
          ko‘rishingiz mumkin.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
