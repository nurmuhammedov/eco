import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PermitTabKey } from '@/features/permits/model/types'
import { cn } from '@/shared/lib/utils'
import { Archive, Clock, FileText, ShieldAlert, ShieldX, Star } from 'lucide-react'
import React from 'react'

interface PermitTabsProps {
  activeTab: PermitTabKey
  onTabChange: (tabKey: string) => void
  counts: Record<string, number>
}

const tabIcons: Record<PermitTabKey, React.ReactNode> = {
  [PermitTabKey.ALL]: <Archive className="h-5 w-5" />,
  [PermitTabKey.PERMIT]: <FileText className="h-5 w-5" />,
  [PermitTabKey.LICENSE]: <Star className="h-5 w-5" />,
  [PermitTabKey.CONCLUSION]: <ShieldAlert className="h-5 w-5" />,
  [PermitTabKey.NEARING_EXPIRY]: <Clock className="h-5 w-5" />,
  [PermitTabKey.EXPIRED]: <ShieldX className="h-5 w-5" />,
}

export const tabs = [
  { key: PermitTabKey.ALL, label: 'Barchasi' },
  { key: PermitTabKey.PERMIT, label: 'Ruxsatnoma' },
  { key: PermitTabKey.LICENSE, label: 'Litsenziya' },
  { key: PermitTabKey.CONCLUSION, label: 'Xulosa' },
]

export const PermitTabs = ({ activeTab, onTabChange, counts }: PermitTabsProps) => {
  return (
    <div className="scrollbar-hidden flex flex-row gap-2 overflow-x-auto pb-2">
      {tabs.map((tab) => {
        const isActive = activeTab == tab.key
        const isNearingExpiry = tab.key === PermitTabKey.NEARING_EXPIRY
        const isExpired = tab.key === PermitTabKey.EXPIRED
        const isSpecial = isNearingExpiry || isExpired

        return (
          <Card
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'flex min-w-[220px] flex-1 cursor-pointer flex-col py-3 transition-all hover:shadow-md',

              !isSpecial && (isActive ? 'bg-teal text-white shadow' : 'bg-card text-card-foreground border-border'),

              isNearingExpiry &&
                (isActive
                  ? 'bg-yellow-500/70 text-white ring-1 ring-yellow-500/70'
                  : 'border-yellow-300 bg-yellow-50 text-yellow-900 hover:bg-yellow-100 dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-900/40'),

              isExpired &&
                (isActive
                  ? 'bg-red-600/70 text-white ring-1 ring-red-600/70'
                  : 'border-red-300 bg-red-50 text-red-900 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/40')
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 px-4 pt-1 pb-2">
              <CardTitle className="text-[15px] leading-tight font-medium">
                <div className="line-clamp-2">{tab.label}</div>
              </CardTitle>
              <span
                className={cn(
                  !isSpecial && !isActive && 'text-muted-foreground',
                  isNearingExpiry && !isActive && 'text-yellow-600 dark:text-yellow-400',
                  isExpired && !isActive && 'text-red-600 dark:text-red-400'
                )}
              >
                {tabIcons[tab.key as unknown as PermitTabKey]}
              </span>
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
