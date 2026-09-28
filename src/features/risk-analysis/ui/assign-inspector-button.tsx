import { Button } from '@/shared/components/ui/button'
import useCustomSearchParams from '@/shared/hooks/api/use-search-params'
import React from 'react'

interface AssignInspectorButtonProps {
  /** The record an inspector is being assigned to */
  row: { id: string }
  disabled?: boolean
}

export const AssignInspectorButton: React.FC<AssignInspectorButtonProps> = ({ row, disabled = false }) => {
  const { addParams } = useCustomSearchParams()

  const handleOpenModal = () => {
    addParams({ objectId: row.id })
  }

  return (
    <Button disabled={disabled} onClick={handleOpenModal}>
      Inspektorni belgilash
    </Button>
  )
}
