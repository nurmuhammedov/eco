import { ChecklistTemplatesDrawer } from '@/features/admin/checklist-templates/ui/checklist-templates-drawer'
import { ChecklistTemplatesList } from '@/features/admin/checklist-templates/ui/checklist-templates-list'
import { Button } from '@/shared/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'
import { useChecklistTemplateDrawer } from '@/shared/hooks/entity-hooks'
import { UIModeEnum } from '@/shared/types'
import { PlusCircle } from 'lucide-react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

const ChecklistTemplatesWidget = () => {
  const { t } = useTranslation('common')
  const { isOpen, onOpen } = useChecklistTemplateDrawer()
  const {
    paramsObject: { active = 'true' },
    addParams,
  } = useCustomSearchParams()

  const handleAdd = () => {
    onOpen(UIModeEnum.CREATE)
  }

  const handleTabChange = (value: string) => {
    addParams({ active: value })
  }

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <Tabs value={active?.toString()} onValueChange={handleTabChange} className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-max grid-cols-2">
            <TabsTrigger value="true">{t('status.active', 'Aktiv')}</TabsTrigger>
            <TabsTrigger value="false">{t('status.inactive', 'Aktiv emas')}</TabsTrigger>
          </TabsList>
          <Button onClick={handleAdd}>
            <PlusCircle /> {t('add_checklist', 'Cheklist qo‘shish')}
          </Button>
        </div>
        <TabsContent className="mt-2 flex flex-1 flex-col overflow-hidden" value={active?.toString() || 'true'}>
          <ChecklistTemplatesList />
        </TabsContent>
      </Tabs>

      {isOpen && <ChecklistTemplatesDrawer />}
    </div>
  )
}

export default memo(ChecklistTemplatesWidget)
