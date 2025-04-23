import React from 'react';
import { Pencil } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { uz } from 'date-fns/locale';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardFooter } from '@/shared/components/ui/card';
import { TemplateCardProps, TemplateTypeIcon } from '@/entities/admin/template';
import { getTemplateType } from '@/features/admin/template/model/use-template-form.ts';

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onEdit }) => {
  const date = parseISO(template.updatedAt ?? template.createdAt);
  return (
    <Card className="overflow-hidden rounded-md transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <TemplateTypeIcon type={template.type} name={template.name} />
            <div className="ml-3">
              <h3 className="font-medium text-gray-800">{template.name}</h3>
              <p className="text-xs text-gray-500">{getTemplateType(template.type)}</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-3 line-clamp-2">{template.description}</p>
      </CardContent>

      <CardFooter className="flex justify-between items-center px-4 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">Oxirgi tahrir: {format(date, 'dd.MM.yyyy HH:mm', { locale: uz })}</p>

        <div className="flex space-x-2">
          <Button size="icon" variant="ghost" onClick={() => onEdit && onEdit(template.id)} className="size-8">
            <Pencil className="size-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
