import { Template, useTemplates } from '@/entities/admin/template'
import { TemplateGrid } from '@/features/admin/template'
import { ResponseData } from '@/shared/types'

export default function TemplatesPage() {
  const { data: templates = [], isLoading } = useTemplates()

  return (
    <div className="container">
      <TemplateGrid templates={templates as unknown as ResponseData<Template>} isLoading={isLoading} />
    </div>
  )
}
