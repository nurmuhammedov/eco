import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTemplate, useUpdateTemplateContent } from '@/entities/admin/template';

export const useEditTemplateContent = () => {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data: template, isLoading } = useTemplate(id);
  const { mutate: updateContent } = useUpdateTemplateContent();
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    if (template?.content) {
      setContent(template.content);
    }
  }, [template?.content]);

  const handleSave = () => {
    if (id) {
      updateContent({ id: Number(id), data: { content } });
    }
  };

  return { content, isLoading, setContent, handleSave };
};
