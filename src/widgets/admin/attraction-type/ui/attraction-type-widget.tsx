import { AttractionTypeDrawer } from '@/features/admin/attraction-type/ui/attraction-type-drawer';
import { AttractionTypeList } from '@/features/admin/attraction-type/ui/attraction-type-list';
import { Button } from '@/shared/components/ui/button';
import { useAttractionTypeDrawer } from '@/shared/hooks/entity-hooks';
import { UIModeEnum } from '@/shared/types';
import { PlusCircle } from 'lucide-react';
import { Fragment, memo } from 'react';

const AttractionTypeWidget = () => {
  const { isOpen, onOpen } = useAttractionTypeDrawer();

  const handleAdd = () => {
    onOpen(UIModeEnum.CREATE);
  };

  return (
    <Fragment>
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-semibold uppercase">Atraksion tipi</h5>
        <Button onClick={handleAdd}>
          <PlusCircle /> Atraksion tipi qo'shish
        </Button>
      </div>
      <AttractionTypeList />
      {isOpen && <AttractionTypeDrawer />}
    </Fragment>
  );
};
export default memo(AttractionTypeWidget);
