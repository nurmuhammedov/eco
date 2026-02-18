import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { cn } from '@/shared/lib/utils'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { ReactNode, useEffect, useRef, useState } from 'react'

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
  classNameRootWrapper?: string
  outlineInactiveCount?: boolean
  showArrows?: boolean
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
  classNameRootWrapper = '',
  outlineInactiveCount = false,
  showArrows = false,
}: TabsLayoutProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [tabs])

  useEffect(() => {
    if (scrollRef.current) {
      const activeTrigger = scrollRef.current.querySelector('[data-state="active"]') as HTMLElement
      if (activeTrigger) {
        const container = scrollRef.current
        const scrollLeft =
          activeTrigger.offsetLeft - container.offsetLeft - container.clientWidth / 2 + activeTrigger.clientWidth / 2
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
      }
    }
  }, [activeTab, tabs])

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' })
    }
  }

  const scrollToStart = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
    }
  }

  const scrollToEnd = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth, behavior: 'smooth' })
    }
  }

  const buttonClass = cn(
    'h-9 w-9 shrink-0 rounded-md border border-input bg-white text-foreground shadow-none transition-all hover:bg-accent hover:text-accent-foreground flex items-center justify-center active:border-2 active:border-primary',
    !canScrollLeft && 'pointer-events-none opacity-50'
  )

  const rightButtonClass = cn(
    'h-9 w-9 shrink-0 rounded-md border border-input bg-white text-foreground shadow-none transition-all hover:bg-accent hover:text-accent-foreground flex items-center justify-center active:border-2 active:border-primary',
    !canScrollRight && 'pointer-events-none opacity-50'
  )

  return (
    <Tabs defaultValue={defaultValue} value={activeTab} onValueChange={onTabChange} className={className}>
      <div className={cn('flex items-center gap-2 p-0', classNameWrapper)}>
        {showArrows && (
          <div className="flex gap-1">
            <Button className={buttonClass} onClick={scrollToStart} aria-disabled={!canScrollLeft} type="button">
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button className={buttonClass} onClick={scrollLeft} aria-disabled={!canScrollLeft} type="button">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className={cn('scrollbar-hidden flex min-w-0 flex-1 overflow-x-auto', classNameRootWrapper)}
        >
          <TabsList className={cn('w-max overflow-visible', classNameTabList)}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              const isDestructive = !outlineInactiveCount || isActive

              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(`select-none hover:bg-neutral-100`, classNameTrigger)}
                >
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
        </div>
        {showArrows && (
          <div className="flex gap-1">
            <Button className={rightButtonClass} onClick={scrollRight} aria-disabled={!canScrollRight} type="button">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button className={rightButtonClass} onClick={scrollToEnd} aria-disabled={!canScrollRight} type="button">
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="ml-auto flex items-center">{action}</div>
      </div>
      {children && <TabsContent value={activeTab}>{children}</TabsContent>}
    </Tabs>
  )
}

export default TabsLayout
