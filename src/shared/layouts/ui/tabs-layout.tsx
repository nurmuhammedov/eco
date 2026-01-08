import { Badge } from '@/shared/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { cn } from '@/shared/lib/utils'
import { ReactNode } from 'react'

interface Tab {
  id: string
  name: string
  count?: number | null
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
  outlineInactiveCount?: boolean
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
  outlineInactiveCount = false,
}: TabsLayoutProps) => {
  return (
    <Tabs defaultValue={defaultValue} value={activeTab} onValueChange={onTabChange} className={className}>
      <div className={cn('scrollbar-hidden flex justify-between overflow-x-auto overflow-y-hidden', classNameWrapper)}>
        <TabsList className={classNameTabList}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const isDestructive = !outlineInactiveCount || isActive

            return (
              <TabsTrigger key={tab.id} value={tab.id} className={cn(`hover:bg-neutral-100`, classNameTrigger)}>
                {tab.renderName ?? (
                  <>
                    {tab.name}
                    {tab.count || tab.count === 0 ? (
                      <Badge
                        variant={isDestructive ? 'destructive' : 'outline'}
                        className={cn(
                          'ml-2',
                          !isDestructive && 'border-teal text-teal/80 bg-transparent hover:bg-transparent'
                        )}
                      >
                        {tab.count}
                      </Badge>
                    ) : null}
                  </>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>
        {action}
      </div>
      {children && <TabsContent value={activeTab}>{children}</TabsContent>}
    </Tabs>
  )
}

export default TabsLayout
