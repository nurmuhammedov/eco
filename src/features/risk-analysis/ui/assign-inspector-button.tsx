import { RiskAnalysisItem } from '@/entities/risk-analysis/models/risk-analysis.types'
import { Button } from '@/shared/components/ui/button'
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'
import React from 'react'

interface AssignInspectorButtonProps {
  row: RiskAnalysisItem
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
