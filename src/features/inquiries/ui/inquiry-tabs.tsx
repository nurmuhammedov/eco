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
    <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
      {inquiryTabsConfig.map((tab) => {
        const isActive = activeTab === tab.key

        return (
          <Card
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'cursor-pointer border transition-all hover:shadow-md',
              isActive ? 'bg-teal text-white shadow' : 'bg-card text-card-foreground border-border'
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm leading-none font-medium">{tab.label}</CardTitle>
              <span className={cn(isActive && 'text-white')}>{tab.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{counts[tab.key] || 0}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
