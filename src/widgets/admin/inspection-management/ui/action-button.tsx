import { memo } from 'react'
import { PlusCircle } from 'lucide-react'
import { ActionButtonProps } from '../types'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/ui/button'

export const ActionButton = memo(({ title, activeTab, onAddCategoryType, onAddChecklist }: ActionButtonProps) => {
  const { t } = useTranslation('common')

  return (
    <div className="flex justify-between">
      <h5 className="text-2xl font-semibold uppercase">{title}</h5>

      {activeTab === 'categoryType' ? (
        <Button onClick={onAddCategoryType}>
          <PlusCircle />
          {t('actions.add_category_type')}
        </Button>
      ) : (
        <Button onClick={onAddChecklist}>
          <PlusCircle />
          {t('actions.add_checklist')}
        </Button>
      )}
    </div>
  )
})

ActionButton.displayName = 'ActionButton'
