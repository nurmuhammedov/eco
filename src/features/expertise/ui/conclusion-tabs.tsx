import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { cn } from '@/shared/lib/utils'
import { Archive, Clock, FileText, ShieldAlert, Star, ShieldX } from 'lucide-react'
import { ReactNode } from 'react'

export enum TabKey {
  ALL = 'ALL',
  LH = 'LH',
  TQ = 'TQ',
  BI = 'BI',
  XD = 'XD',
  IX = 'IX',
}

interface PermitTabsProps {
  activeTab: TabKey
  onTabChange: (tabKey: string) => void
  counts?: Record<string, number>
}

const tabIcons: Record<TabKey, ReactNode> = {
  [TabKey.ALL]: <Archive className="h-5 w-5" />,
  [TabKey.LH]: <FileText className="h-5 w-5" />,
  [TabKey.TQ]: <Star className="h-5 w-5" />,
  [TabKey.BI]: <ShieldAlert className="h-5 w-5" />,
  [TabKey.XD]: <Clock className="h-5 w-5" />,
  [TabKey.IX]: <ShieldX className="h-5 w-5" />,
}

export const tabs = [
  { key: TabKey.ALL, label: 'Barchasi' },
  {
    key: TabKey.LH,
    label:
      'Xavfli ishlab chiqarish obyektini qurish, kengaytirish, qayta qurish, texnik jihatdan qayta jihozlash, konservatsiyalash va tugatishga doir loyiha hujjatlari (LH)',
  },
  {
    key: TabKey.TQ,
    label: 'Xavfli ishlab chiqarish obyektida qo‘llaniladigan texnika qurilmalari (TQ)',
  },
  { key: TabKey.BI, label: 'Xavfli ishlab chiqarish obyektidagi binolar va inshootlar (BI)' },
  { key: TabKey.XD, label: 'Sanoat xavfsizligi deklaratsiyasi (XD)' },
  { key: TabKey.IX, label: 'Xavfli ishlab chiqarish obyektlarini identifikatsiyalash (IX)' },
]

export const ConclusionTabs = ({ activeTab, onTabChange, counts }: PermitTabsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {tabs.map((tab) => {
        const isActive = activeTab == tab.key

        return (
          <Card
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'cursor-pointer gap-1 py-3 transition-all hover:shadow-md',
              isActive ? 'bg-teal text-white shadow' : 'bg-card text-card-foreground border-border'
            )}
          >
            <CardContent className="flex flex-row items-center justify-between space-y-0 pb-1">
              <div className="text-2xl font-bold">{counts?.[tab.key] || 0}</div>
              <span className={cn(!isActive && 'text-muted-foreground')}>{tabIcons[tab.key as unknown as TabKey]}</span>
            </CardContent>
            <CardHeader className="py-2">
              <CardTitle className="text-sm font-medium">{tab.label}</CardTitle>
            </CardHeader>
          </Card>
        )
      })}
    </div>
  )
}
