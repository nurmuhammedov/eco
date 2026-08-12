import { memo } from 'react'
import { PlusCircle } from 'lucide-react'
import { ActionButtonProps } from '../types'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/ui/button'

export const ActionButton = memo(({ activeTab, onAddRegion, onAddDistrict }: ActionButtonProps) => {
  const { t } = useTranslation('common')
  return (
    <>
      {activeTab === 'regions' ? (
        <Button onClick={onAddRegion}>
          <PlusCircle />
          {t('actions.add_region')}
        </Button>
      ) : (
        <Button onClick={onAddDistrict}>
          <PlusCircle /> {t('actions.add_district')}
        </Button>
      )}
    </>
  )
})
ActionButton.displayName = 'ActionButton'
