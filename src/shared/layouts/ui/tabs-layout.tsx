import { Badge } from '@/shared/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { cn } from '@/shared/lib/utils.ts'
import { ReactNode } from 'react'

interface Tab {
  id: string
  name: string
  count?: number
  renderName?: ReactNode
}

interface TabsLayoutProps {
  tabs: Tab[]
  action?: ReactNode
  activeTab: string
  className?: string
  children?: ReactNode
  defaultValue?: string
  classNameTabList?: string
  classNameTrigger?: string
  classNameWrapper?: string
  onTabChange: (value: string) => void
}

export const TabsLayout = ({
  tabs,
  action,
  defaultValue,
  activeTab,
  onTabChange,
  children,
  className = '',
  classNameTrigger = '',
  classNameTabList = '',
  classNameWrapper = '',
}: TabsLayoutProps) => {
  return (
    <Tabs defaultValue={defaultValue} value={activeTab} onValueChange={onTabChange} className={className}>
      <div className={cn('no-scrollbar flex justify-between overflow-x-auto overflow-y-hidden', classNameWrapper)}>
        <TabsList className={classNameTabList}>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className={cn(`hover:bg-neutral-100`, classNameTrigger)}>
              {tab.renderName ?? (
                <>
                  {tab.name}
                  {tab.count || tab.count == 0 ? (
                    <Badge variant="destructive" className="ml-2">
                      {tab.count}
                    </Badge>
                  ) : null}
                </>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        {action}
      </div>
      {children && <TabsContent value={activeTab}>{children}</TabsContent>}
    </Tabs>
  )
}

export default TabsLayout
