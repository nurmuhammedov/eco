import { BaseDrawer } from '@/shared/components/common/base-drawer'
import FormSkeleton from '@/shared/components/common/form-skeleton/ui'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useUIActionLabel } from '@/shared/hooks'
import { useAttractionTypeDrawer } from '@/shared/hooks/entity-hooks'
import { useTranslation } from 'react-i18next'
import { useAttractionTypeForm } from '../model/use-attraction-type-form'

export const AttractionTypeDrawer = () => {
  const { t } = useTranslation('common')
  const { isOpen, onClose, mode } = useAttractionTypeDrawer()
  const { form, onSubmit, isPending, isCreate, isFetching, attractionOptions } = useAttractionTypeForm()
  const modeState = useUIActionLabel(mode)

  return (
    <BaseDrawer
      asForm
      open={isOpen}
      title={modeState}
      onClose={onClose}
      loading={isPending}
      disabled={isPending}
      onSubmit={onSubmit}
    >
      <Form {...form}>
        <div className="space-y-4">
          {isFetching && !isCreate ? (
            <FormSkeleton length={2} />
          ) : (
            <>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>{t('name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('name')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="childEquipmentId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Atraksion turi</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        value={field.value}
                        onValueChange={(value) => {
                          if (value) {
                            field.onChange(value)
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Turini tanlang" />
                        </SelectTrigger>
                        <SelectContent>{attractionOptions}</SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
      </Form>
    </BaseDrawer>
  )
}
