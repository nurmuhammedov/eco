import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { useCustomSearchParams } from '@/shared/hooks'
import { SkudDevicesTab } from './skud-devices-tab'
import { SkudEventsTab } from './skud-events-tab'
import { SkudUnmatchedTab } from './skud-unmatched-tab'

const TABS = [
  { id: 'devices', label: 'Qurilmalar', Content: SkudDevicesTab },
  { id: 'events', label: 'Kirish-chiqish hodisalari', Content: SkudEventsTab },
  { id: 'unmatched', label: 'Bog‘lanmagan raqamlar', Content: SkudUnmatchedTab },
]

export default function SkudPage() {
  const {
    paramsObject: { tab = 'devices' },
    addParams,
  } = useCustomSearchParams()

  const active = TABS.find((item) => item.id === tab) ?? TABS[0]
  const Content = active.Content

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      <Tabs
        value={active.id}
        // Filters of one tab mean nothing on another
        onValueChange={(value) =>
          addParams(
            { tab: value },
            'page',
            'size',
            'date_from',
            'date_to',
            'direction',
            'search',
            'region_id',
            'device_id'
          )
        }
      >
        <TabsList className="h-auto flex-wrap">
          {TABS.map((item) => (
            <TabsTrigger key={item.id} value={item.id}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Content />
    </div>
  )
}
