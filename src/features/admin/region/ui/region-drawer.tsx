import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useUIActionLabel } from '@/shared/hooks'
import { Input } from '@/shared/components/ui/input'
import { useRegionForm } from '../model/use-region-form'
import { useRegionDrawer } from '@/shared/hooks/entity-hooks'
import { InputNumber } from '@/shared/components/ui/input-number'
import { BaseDrawer } from '@/shared/components/common/base-drawer'
import FormSkeleton from '@/shared/components/common/form-skeleton/ui'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'

export const RegionDrawer = () => {
  const { t } = useTranslation('common')
  const { isOpen, onClose, mode } = useRegionDrawer()
  const modeState = useUIActionLabel(mode)
  const { form, onSubmit, isPending, isCreate, isFetching } = useRegionForm()

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
            <FormSkeleton length={3} />
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
                name="soato"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('soato')}</FormLabel>
                    <FormControl>
                      <InputNumber maxLength={7} placeholder={t('soato')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="number"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('number')}</FormLabel>
                    <FormControl>
                      <InputNumber maxLength={7} placeholder={t('number')} {...field} />
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
