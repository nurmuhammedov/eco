import { Plus } from 'lucide-react';
import { useUI } from '@/entities/ui';
import { Button } from '@/shared/components/ui/button';
import { UIModeEnum } from '@/entities/ui/types/ui-types';

export function DistrictFilter() {
  const { onOpen } = useUI();
  return (
    <div className="flex items-center justify-between mb-4">
      <h6 className="page-sub-title">Tumanlar</h6>
      <Button onClick={() => onOpen(UIModeEnum.CREATE, 'district-drawer')}>
        <Plus /> Yaratish
      </Button>
    </div>
  );
}
