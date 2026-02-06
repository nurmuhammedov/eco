import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { cn } from '@/shared/lib/utils'
import { CheckCircle2, Layers, Loader2, RotateCcw, XCircle } from 'lucide-react'
import React from 'react'

export enum DeclarationTabKey {
  ALL = 'ALL',
  IN_PROGRESS = 'IN_PROGRESS',
  RETURNED = 'RETURNED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

interface DeclarationTabsProps {
  activeTab: string
  onTabChange: (tabKey: string) => void
  counts?: Record<string, number>
}

const tabIcons: Record<string, React.ReactNode> = {
  [DeclarationTabKey.ALL]: <Layers className="h-5 w-5" />,
  [DeclarationTabKey.IN_PROGRESS]: <Loader2 className="h-5 w-5" />,
  [DeclarationTabKey.RETURNED]: <RotateCcw className="h-5 w-5" />,
  [DeclarationTabKey.APPROVED]: <CheckCircle2 className="h-5 w-5" />,
  [DeclarationTabKey.REJECTED]: <XCircle className="h-5 w-5" />,
}

export const tabs = [
  { key: DeclarationTabKey.ALL, label: 'Barchasi' },
  { key: DeclarationTabKey.IN_PROGRESS, label: 'Jarayonda' },
  { key: DeclarationTabKey.RETURNED, label: 'Qayta ishlashda' },
  { key: DeclarationTabKey.APPROVED, label: 'Yakunlangan' },
  { key: DeclarationTabKey.REJECTED, label: 'Bekor qilingan' },
]

export const DeclarationTabs = ({ activeTab, onTabChange, counts = {} }: DeclarationTabsProps) => {
  return (
    <div className="mb-2 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {tabs.map((tab) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        const isActive = activeTab === tab.key

        return (
          <Card
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              isActive ? 'bg-teal text-white shadow' : 'bg-card text-card-foreground border-border'
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{tab.label}</CardTitle>
              <span className={cn(!isActive && 'text-muted-foreground')}>{tabIcons[tab.key]}</span>
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
