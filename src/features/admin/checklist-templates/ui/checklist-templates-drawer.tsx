// src/features/admin/checklist-templates/ui/checklist-templates-drawer.tsx
import { BaseDrawer } from '@/shared/components/common/base-drawer'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import FormSkeleton from '@/shared/components/common/form-skeleton/ui'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { useUIActionLabel } from '@/shared/hooks'
import { useChecklistTemplateDrawer } from '@/shared/hooks/entity-hooks'
import { UIModeEnum } from '@/shared/types'
import { useTranslation } from 'react-i18next'
import { useChecklistTemplateForm } from '../model/use-checklist-template-form'

export const ChecklistTemplatesDrawer = () => {
  const { t } = useTranslation('common')
  const { isOpen, onClose, mode } = useChecklistTemplateDrawer()
  const { form, onSubmit, isPending, isCreate, isFetching } = useChecklistTemplateForm()
  const actionLabel = useUIActionLabel(mode)

  return (
    <BaseDrawer asForm open={isOpen} title={actionLabel} onClose={onClose} onSubmit={onSubmit} loading={isPending}>
      <Form {...form}>
        <div className="space-y-4">
          {isFetching && !isCreate ? (
            <FormSkeleton length={3} />
          ) : (
            <>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>{t('checklist_name', 'Cheklist nomi')}</FormLabel>
                    <FormControl>
                      <Input
                        disabled={mode == UIModeEnum.EDIT}
                        placeholder={t('checklist_name_placeholder', 'Cheklist nomini kiriting')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {mode != UIModeEnum.EDIT && (
                <FormField
                  name="path"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>{t('checklist_file', 'Cheklist fayli')}</FormLabel>
                      <FormControl>
                        <InputFile
                          form={form}
                          name={field.name}
                          accept={[FileTypes.PDF]}
                          buttonText={t('upload_pdf', 'PDF fayl yuklash')}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              {mode == UIModeEnum.EDIT && (
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t('status.active', 'Aktiv')}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              )}
            </>
          )}
        </div>
      </Form>
    </BaseDrawer>
  )
}
