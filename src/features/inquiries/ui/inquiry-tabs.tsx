import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { cn } from '@/shared/lib/utils'
import { InquiryBelongType, inquiryTabsConfig } from '../model/types'

interface InquiryTabsProps {
  activeTab: InquiryBelongType
  onTabChange: (tabKey: InquiryBelongType) => void
  counts?: Record<string, number>
}

export const InquiryTabs = ({ activeTab, onTabChange, counts = {} }: InquiryTabsProps) => {
  return (
    <div className="scrollbar-hidden flex flex-row gap-2 overflow-x-auto pb-2">
      {inquiryTabsConfig.map((tab) => {
        const isActive = activeTab === tab.key

        return (
          <Card
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
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
  )
}
