// src/features/risk-analysis/ui/assign-inspector-button.tsx
import { RiskAnalysisItem } from '@/entities/risk-analysis/models/risk-analysis.types';
import { Button } from '@/shared/components/ui/button';
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams';
import React from 'react';

interface AssignInspectorButtonProps {
  row: RiskAnalysisItem;
}

export const AssignInspectorButton: React.FC<AssignInspectorButtonProps> = ({ row }) => {
  const { addParams } = useCustomSearchParams();

  const handleOpenModal = () => {
    addParams({ objectId: row.id });
  };

  return <Button onClick={handleOpenModal}>Inspektorni belgilash</Button>;
};
