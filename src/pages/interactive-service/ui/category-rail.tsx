import { cn } from '@/shared/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { CATEGORIES, CategoryId } from '../model/categories'

interface CategoryRailProps {
  active: CategoryId
  onSelect: (id: CategoryId) => void
}

export const CategoryRail = ({ active, onSelect }: CategoryRailProps) => (
  <TooltipProvider delayDuration={80}>
    <nav
      aria-label="Bo‘limlar"
      className="flex shrink-0 flex-row gap-1.5 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm lg:flex-col lg:gap-2 lg:overflow-visible lg:p-2"
    >
      {CATEGORIES.map((category) => {
        const Icon = category.icon
        const isActive = active === category.id

        return (
          <Tooltip key={category.id}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onSelect(category.id)}
                aria-pressed={isActive}
                className={cn(
                  'group flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl transition-all duration-200 lg:size-13',
                  isActive ? 'bg-teal text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                )}
              >
                <Icon className={cn('size-5 transition-transform lg:size-6', isActive && 'scale-110')} />
                <span className="sr-only">{category.label}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12} className="z-[110] text-sm font-medium">
              {category.label}
            </TooltipContent>
          </Tooltip>
        )
      })}
    </nav>
  </TooltipProvider>
)
