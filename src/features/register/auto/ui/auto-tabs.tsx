import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { cn } from '@/shared/lib/utils'
import { Layers, Fuel, Flame, FlaskConical, ThermometerSnowflake, Atom } from 'lucide-react'
import { ReactNode } from 'react'

export enum AutoTabKey {
  ALL = 'ALL',
  OIL_PRODUCTS = 'OIL',
  LPG_TRANSPORT = 'LPG',
  CHEMICALS = 'CHEMICAL',
  CRYOGENIC_GASES = 'CRYOGENIC',
  NUCLEAR_MATERIALS = 'RADIOACTIVE',
}

interface TabsProps {
  activeTab: AutoTabKey
  onTabChange: (tabKey: string) => void
  counts?: Record<string, number>
}

const tabIcons: Record<AutoTabKey, ReactNode> = {
  [AutoTabKey.ALL]: <Layers className="h-5 w-5" />,
  [AutoTabKey.OIL_PRODUCTS]: <Fuel className="h-5 w-5" />,
  [AutoTabKey.LPG_TRANSPORT]: <Flame className="h-5 w-5" />,
  [AutoTabKey.CHEMICALS]: <FlaskConical className="h-5 w-5" />,
  [AutoTabKey.CRYOGENIC_GASES]: <ThermometerSnowflake className="h-5 w-5" />,
  [AutoTabKey.NUCLEAR_MATERIALS]: <Atom className="h-5 w-5" />,
}

export const tabs = [
  { key: AutoTabKey.ALL, label: 'Barchasi' },
  { key: AutoTabKey.OIL_PRODUCTS, label: 'Neft mahsulotlarini tashish' },
  { key: AutoTabKey.LPG_TRANSPORT, label: 'Suyultirilgan uglevodorod gazini tashish' },
  { key: AutoTabKey.CHEMICALS, label: 'Kimyoviy moddalarni tashish' },
  { key: AutoTabKey.CRYOGENIC_GASES, label: 'Suyultirilgan va siqilgan kriogen gazini tashish' },
  { key: AutoTabKey.NUCLEAR_MATERIALS, label: 'Yadroviy va radioaktiv materiallarni tashish' },
]

export const AutoTabs = ({ activeTab, onTabChange, counts }: TabsProps) => {
  return (
    <div className="scrollbar-hidden flex justify-between gap-2 overflow-x-auto overflow-y-hidden">
      {tabs.map((tab) => {
        const isActive = activeTab == tab.key

        return (
          <Card
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'flex-1 cursor-pointer gap-1 py-3 transition-all hover:shadow-md',
              isActive ? 'bg-teal text-white shadow' : 'bg-card text-card-foreground border-border'
            )}
          >
            <CardContent className="flex flex-row items-center justify-between space-y-0 pb-1">
              <div className="text-2xl font-bold">{counts?.[tab.key] || 0}</div>
              <span className={cn(!isActive && 'text-muted-foreground')}>
                {tabIcons[tab.key as unknown as AutoTabKey]}
              </span>
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
