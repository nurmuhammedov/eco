import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { useCustomSearchParams } from '@/shared/hooks'
import { OrgEmployeesTab } from './org-employees-tab'
import { OrgPositionsTab } from './org-positions-tab'
import { PartnerOrgsTab } from './partner-orgs-tab'
import { ProcessParticipantsTab } from './process-participants-tab'
import { ToolbarSlotContext } from './shared'
import { WorkflowDefinitionsTab } from './workflow-definitions-tab'

// Ordered the way the setup has to be done: each step depends on the one before it.
const TABS = [
  { id: 'orgs', label: 'Tashkilotlar', Content: PartnerOrgsTab },
  { id: 'positions', label: 'Lavozimlar', Content: OrgPositionsTab },
  { id: 'employees', label: 'Xodimlar', Content: OrgEmployeesTab },
  { id: 'definitions', label: 'Pog‘onalar', Content: WorkflowDefinitionsTab },
  { id: 'participants', label: 'Ishtirokchilar', Content: ProcessParticipantsTab },
]

export default function OrgWorkflowPage() {
  const {
    paramsObject: { tab = 'orgs' },
    addParams,
  } = useCustomSearchParams()

  const [toolbarSlot, setToolbarSlot] = useState<HTMLDivElement | null>(null)

  const active = TABS.find((item) => item.id === tab) ?? TABS[0]
  const Content = active.Content

  return (
    <ToolbarSlotContext.Provider value={toolbarSlot}>
      <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
        <div className="flex flex-wrap items-center gap-2">
          <Tabs
            value={active.id}
            onValueChange={(value) => addParams({ tab: value }, 'page', 'positionId', 'isActive')}
          >
            <TabsList className="h-auto flex-wrap">
              {TABS.map((item) => (
                <TabsTrigger key={item.id} value={item.id}>
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div ref={setToolbarSlot} className="flex min-w-0 flex-1 flex-wrap items-center gap-2" />
        </div>

        {toolbarSlot && <Content />}
      </div>
    </ToolbarSlotContext.Provider>
  )
}
