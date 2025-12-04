import React from 'react'
import { GoBack } from '@/shared/components/common'
import { Button } from '@/shared/components/ui/button'

interface EditTemplateActionsProps {
  onSave: () => void
}

export const EditTemplateContentActions: React.FC<EditTemplateActionsProps> = ({ onSave }) => {
  return (
    <div className="mb-4 flex justify-between">
      <GoBack title="Shablonlar" />
      <Button onClick={onSave}>Saqlash</Button>
    </div>
  )
}
