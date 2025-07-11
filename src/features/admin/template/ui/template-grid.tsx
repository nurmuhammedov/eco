import React, { Fragment } from 'react';
import { PlusCircle } from 'lucide-react';
import { ResponseData, UIModeEnum } from '@/shared/types';
import { TemplateDrawer } from './template-drawer';
import { Button } from '@/shared/components/ui/button';
import { useTemplateDrawer } from '@/shared/hooks/entity-hooks';
import { Template, TemplateCard } from '@/entities/admin/template';
import { DataTablePagination } from '@/shared/components/common/data-table';
import { useCustomSearchParams } from '@/shared/hooks';

interface TemplateGridProps {
  isLoading: boolean;
  templates: ResponseData<Template>;
}

export const TemplateGrid: React.FC<TemplateGridProps> = ({ templates, isLoading }) => {
  const { onOpen } = useTemplateDrawer();
  const { addParams } = useCustomSearchParams();
  const handleOpenCreateDialog = () => {
    onOpen(UIModeEnum.CREATE);
  };

  const handleOpenEditDialog = (id: number) => {
    onOpen(UIModeEnum.EDIT, { id });
  };

  return (
    <Fragment>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Shablonlar</h2>
          <Button onClick={handleOpenCreateDialog}>
            <PlusCircle className="size-4" />
            Yaratish
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[200px] rounded-lg border border-gray-200 bg-gray-50 animate-pulse" />
            ))}
          </div>
        ) : templates?.content?.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <p className="text-gray-500">No templates available. Create your first template!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4">
            {templates?.content?.map((template) => (
              <TemplateCard key={template.id} template={template} onEdit={() => handleOpenEditDialog(template.id)} />
            ))}
          </div>
        )}

        <DataTablePagination
          data={templates}
          isLoading={isLoading}
          onPageChange={(size) => addParams({ page: size })}
          onPageSizeChange={(size) => addParams({ size: size }, 'page', 'p')}
        />
      </div>
      <TemplateDrawer />
    </Fragment>
  );
};
