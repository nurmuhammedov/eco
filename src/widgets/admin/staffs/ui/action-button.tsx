import { memo } from 'react'
import { PlusCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/ui/button'
import { StaffsActiveTab, StaffsActiveTabActionButtonProps } from '../types'

export const StaffsActionButton = memo(
  ({ activeTab, onAddCommitteeStaffs, onAddTerritorialStaffs }: StaffsActiveTabActionButtonProps) => {
    const { t } = useTranslation('common')
    return (
      <>
        {activeTab === StaffsActiveTab.COMMITTEE_STAFFS ? (
          <Button onClick={onAddCommitteeStaffs}>
            <PlusCircle />
            {t('actions.add_committee_staff')}
          </Button>
        ) : (
          <Button onClick={onAddTerritorialStaffs}>
            <PlusCircle /> {t('actions.add_territorial_staff')}
          </Button>
        )}
      </>
    )
  }
)
StaffsActionButton.displayName = 'StaffsActionButton'
