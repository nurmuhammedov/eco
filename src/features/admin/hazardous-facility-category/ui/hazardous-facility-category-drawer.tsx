import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/components/ui/input'
import { useUIActionLabel } from '@/shared/hooks'

import { BaseDrawer } from '@/shared/components/common/base-drawer'
import FormSkeleton from '@/shared/components/common/form-skeleton/ui'
import { useHazardousFacilityCategoryDrawer } from '@/shared/hooks/entity-hooks'
import { useHazardousFacilityCategoryForm } from '../model/use-hazardous-facility-category-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'

export const HazardousFacilityCategoryDrawer = () => {
  const { t } = useTranslation('common')
  const { isOpen, mode, onClose } = useHazardousFacilityCategoryDrawer()
  const modeState = useUIActionLabel(mode)
  const { form, onSubmit, isPending, isCreate, isFetching } = useHazardousFacilityCategoryForm()

  return (
    <BaseDrawer
      asForm
      open={isOpen}
      onClose={onClose}
      title={modeState}
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
            </Fragment>
          )}
        </div>
      </Form>
    </BaseDrawer>
  )
}
