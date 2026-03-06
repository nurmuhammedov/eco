import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { cn } from '@/shared/lib/utils'
import { CheckCircle2, Layers, Loader2, RotateCcw, XCircle } from 'lucide-react'
import React from 'react'

export enum DeclarationTabKey {
  ALL = 'ALL',
  IN_PROCESS = 'IN_PROCESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
}

interface DeclarationTabsProps {
  activeTab: string
  onTabChange: (tabKey: string) => void
  counts?: Record<string, number>
}

const tabIcons: Record<string, React.ReactNode> = {
  [DeclarationTabKey.ALL]: <Layers className="h-5 w-5" />,
  [DeclarationTabKey.IN_PROCESS]: <Loader2 className="h-5 w-5" />,
  [DeclarationTabKey.COMPLETED]: <CheckCircle2 className="h-5 w-5" />,
  [DeclarationTabKey.REJECTED]: <XCircle className="h-5 w-5" />,
  [DeclarationTabKey.CANCELED]: <RotateCcw className="h-5 w-5" />,
}

export const tabs = [
  { key: DeclarationTabKey.ALL, label: 'Barchasi' },
  { key: DeclarationTabKey.IN_PROCESS, label: 'Jarayonda' },
  { key: DeclarationTabKey.COMPLETED, label: 'Yakunlangan' },
  { key: DeclarationTabKey.REJECTED, label: 'Rad etilgan' },
  { key: DeclarationTabKey.CANCELED, label: 'Bekor qilingan' },
]

export const DeclarationTabs = ({ activeTab, onTabChange, counts = {} }: DeclarationTabsProps) => {
  return (
    <div className="scrollbar-hidden flex flex-row gap-2 overflow-x-auto pb-2">
      {tabs.map((tab) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
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
              <span className={cn(!isActive && 'text-muted-foreground')}>{tabIcons[tab.key]}</span>
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
