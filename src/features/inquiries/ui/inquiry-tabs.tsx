import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
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
            <Card
              key={tab.key}
              onClick={() => onTabChange(tab.key as InquiryBelongType | 'ALL')}
              className={cn(
                'flex min-w-[220px] flex-1 cursor-pointer flex-col py-3 transition-all hover:shadow-md',
                isActive ? 'bg-teal text-white shadow' : 'bg-card text-card-foreground border-border'
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 px-4 pt-1 pb-2">
                <CardTitle className="text-[15px] leading-tight font-medium">
                  <div className="line-clamp-2">{tab.label}</div>
                </CardTitle>
                <span className={cn(isActive && 'text-white')}>{tab.icon}</span>
              </CardHeader>
              <CardContent className="p-0 px-4 pt-1 pb-1">
                <div className="text-2xl font-bold">{counts[tab.key] || 0}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
