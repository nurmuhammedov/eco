import { useTemplate, useUpdateTemplateContent } from '@/entities/admin/template';
import { useParams } from 'react-router-dom';

export const useTemplateContent = () => {
  const { id } = useParams<{ id: string }>();
  const { mutate: updateContent } = useUpdateTemplateContent();

  const { data: template } = useTemplate(id);

  console.log('template', template);

  const handleSave = (content: string) => {
    updateContent({ id, data: { content } });
  };

  return { handleSave, initialContent: template?.content };
};
