import { cn } from '@/shared/lib/utils'
import { InquiryBelongType, inquiryTabsConfig } from '../model/types'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'

interface InquiryTabsProps {
  activeTab: InquiryBelongType | 'ALL'
  onTabChange: (tabKey: InquiryBelongType | 'ALL') => void
  counts?: Record<string, number>
  isMobileIndividual?: boolean
}

export const InquiryTabs = ({ activeTab, onTabChange, counts = {}, isMobileIndividual = false }: InquiryTabsProps) => {
  return (
    <>
      {isMobileIndividual && (
        <Tabs
          value={String(activeTab)}
          onValueChange={(val) => onTabChange(val as InquiryBelongType | 'ALL')}
          className="w-full md:hidden"
        >
          <TabsList className="scrollbar-hidden flex w-full justify-start overflow-x-auto pb-1">
            {inquiryTabsConfig.map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="min-w-[120px] flex-1 py-1.5 text-[13px] whitespace-nowrap"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <div
        className={cn(
          'scrollbar-hidden flex-row gap-2 overflow-x-auto pb-2',
          isMobileIndividual ? 'hidden md:flex' : 'flex'
        )}
      >
        {inquiryTabsConfig.map((tab) => {
          const isActive = String(activeTab) === tab.key

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key as InquiryBelongType | 'ALL')}
              aria-pressed={isActive}
              className={cn(
                'group flex min-w-[170px] flex-1 items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all',
                isActive
                  ? 'border-teal bg-teal text-white shadow-md'
                  : 'bg-card text-card-foreground border-border hover:border-teal/40 hover:shadow-sm'
              )}
            >
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors',
                  isActive ? 'bg-white/20 text-white' : 'bg-teal/10 text-teal group-hover:bg-teal/15'
                )}
              >
                {tab.icon}
              </span>
              <span className="min-w-0">
                <span className={cn('block truncate text-sm', isActive ? 'text-white/85' : 'text-muted-foreground')}>
                  {tab.label}
                </span>
                <span className="block text-2xl leading-tight font-bold tabular-nums">
                  {(counts[tab.key] || 0).toLocaleString('ru-RU')}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </>
  )
}
