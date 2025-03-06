import { useUI } from '@/entities/ui';
import { Button } from '@/shared/components/ui/button';
import { UIModeEnum } from '@/entities/ui/types/ui-types';

export function DistrictFilter() {
  const { onOpen } = useUI();
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Button onClick={() => onOpen(UIModeEnum.CREATE, 'district-drawer')}>
          Add
        </Button>
      </div>
    </div>
  );
}
