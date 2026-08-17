import { useUpdateLegalInfo } from '@/features/application/application-detail/hooks/use-update-legal-info.tsx'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { cn } from '@/shared/lib/utils'
import { RefreshCcw } from 'lucide-react'

export const RefreshLegalInfoButton = ({ tinNumber }: { tinNumber: any }) => {
  const { handleUpdate, isPending } = useUpdateLegalInfo(tinNumber)

  if (!tinNumber) return null

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            disabled={isPending}
            onClick={handleUpdate}
            className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-blue-300 bg-white text-blue-600 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-50 active:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw size={15} className={cn(isPending && 'animate-spin')} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-64">
          Tashkilot ma’lumotlarini soliq tizimidan yangilash
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
