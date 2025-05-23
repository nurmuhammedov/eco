import { useTemplates } from '@/entities/admin/template';
import { TemplateGrid } from '@/features/admin/template';

export default function TemplatesPage() {
  const { data: templates = [], isLoading } = useTemplates();

  return (
    <div className="container">
      <TemplateGrid templates={templates} isLoading={isLoading} />
    </div>
  );
}
