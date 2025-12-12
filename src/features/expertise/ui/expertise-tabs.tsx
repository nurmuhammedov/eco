import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { cn } from '@/shared/lib/utils'
import { CheckCircle2, Clock, Layers, ShieldX } from 'lucide-react'

export enum ExpertiseTabKey {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  EXPIRING_SOON = 'EXPIRING_SOON',
  EXPIRED = 'EXPIRED',
}

interface ExpertiseTabsProps {
  activeTab: ExpertiseTabKey
  onTabChange: (tabKey: ExpertiseTabKey) => void
  counts: Record<string, number>
}

const tabIcons: Record<ExpertiseTabKey, React.ReactNode> = {
  [ExpertiseTabKey.ALL]: <Layers className="h-5 w-5" />,
  [ExpertiseTabKey.ACTIVE]: <CheckCircle2 className="h-5 w-5" />,
  [ExpertiseTabKey.EXPIRING_SOON]: <Clock className="h-5 w-5" />,
  [ExpertiseTabKey.EXPIRED]: <ShieldX className="h-5 w-5" />,
}

export const tabs = [
  { key: ExpertiseTabKey.ALL, label: 'Barchasi' },
  { key: ExpertiseTabKey.ACTIVE, label: 'Aktiv' },
  { key: ExpertiseTabKey.EXPIRING_SOON, label: 'Muddati yaqinlashayotganlar' },
  { key: ExpertiseTabKey.EXPIRED, label: 'Muddatidan o‘tganlar' },
]

export const ExpertiseTabs = ({ activeTab, onTabChange, counts }: ExpertiseTabsProps) => {
  return (
    <div className="mb-2 grid grid-cols-2 gap-4 md:grid-cols-4">
      {tabs.map((tab) => {
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
              <span className={cn(isActive && 'text-white')}>{tabIcons[tab.key]}</span>
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
