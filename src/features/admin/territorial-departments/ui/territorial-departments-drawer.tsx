import { BaseDrawer } from '@/shared/components/common/base-drawer'
import FormSkeleton from '@/shared/components/common/form-skeleton/ui'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useUIActionLabel } from '@/shared/hooks'
import { useTerritorialDepartmentsDrawer } from '@/shared/hooks/entity-hooks'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTerritorialDepartmentsForm } from '../model/use-territorial-departments-form'

export const TerritorialDepartmentsDrawer = () => {
  const { t } = useTranslation('common')
  const { isOpen, onClose, isCreate, mode } = useTerritorialDepartmentsDrawer()
  const { form, onSubmit, isPending, isFetching, regionOptions: regions } = useTerritorialDepartmentsForm()
  const modeState = useUIActionLabel(mode)

  const regionOptions = useMemo(() => getSelectOptions(regions), [regions])

  return (
    <BaseDrawer
      asForm
      open={isOpen}
      title={modeState}
      onClose={onClose}
      loading={isPending}
      disabled={isPending}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <div className="space-y-4">
          {isFetching && !isCreate ? (
            <FormSkeleton length={2} />
          ) : (
            <Fragment>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('name')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="regionId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('region')}</FormLabel>
                    <FormControl>
                      <Select
                        value={String(field.value)}
                        onValueChange={(value) => {
                          if (value) {
                            field.onChange(Number(value))
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('select_region')} />
                        </SelectTrigger>
                        <SelectContent>{regionOptions}</SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Fragment>
          )}
        </div>
      </Form>
    </BaseDrawer>
  )
}
