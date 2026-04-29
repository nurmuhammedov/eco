import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useUIActionLabel } from '@/shared/hooks'
import { Input } from '@/shared/components/ui/input'
import { useParksForm } from '../model/use-parks-form'
import { useParkDrawer } from '@/shared/hooks/entity-hooks'
import { BaseDrawer } from '@/shared/components/common/base-drawer'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useDistrictsSelectQuery, useRegionSelectQuery } from '@/entities/admin/districts'
import { Park } from '@/entities/admin/park'
import { YandexMapModal } from '@/shared/components/common/yandex-map-modal'

export const ParksDrawer = () => {
  const { t } = useTranslation('common')
  const { isOpen, onClose, mode, data: drawerData } = useParkDrawer()
  const modeState = useUIActionLabel(mode)

  const { form, onSubmit, isLoading } = useParksForm({
    onSuccess: onClose,
    initialData: String(mode) === 'edit' ? (drawerData as Park) : null,
  })

  const regionId = form.watch('regionId')
  const { data: regions } = useRegionSelectQuery()
  const { data: districts } = useDistrictsSelectQuery(Number(regionId))

  const regionOptions = useMemo(() => getSelectOptions(regions), [regions])
  const districtOptions = useMemo(() => getSelectOptions(districts), [districts])

  return (
    <BaseDrawer
      asForm
      open={isOpen}
      title={modeState}
      onClose={onClose}
      loading={isLoading}
      disabled={isLoading}
      onSubmit={onSubmit}
    >
      <Form {...form}>
        <div className="space-y-4">
          <Fragment>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('park_name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('park_name')} {...field} />
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
                      value={field.value ? String(field.value) : undefined}
                      onValueChange={(val) => {
                        field.onChange(val)
                        form.setValue('districtId', '')
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

            <FormField
              name="districtId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('district')}</FormLabel>
                  <FormControl>
                    <Select
                      disabled={!regionId}
                      value={field.value ? String(field.value) : ''}
                      onValueChange={(val) => field.onChange(val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('select_district')} />
                      </SelectTrigger>
                      <SelectContent>{districtOptions}</SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('address')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('address')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="location"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('location')}</FormLabel>
                  <FormControl>
                    <YandexMapModal
                      initialCoords={field.value ? field.value.split(',').map((c: string) => Number(c.trim())) : null}
                      onConfirm={(coords: string) => field.onChange(coords)}
                      label={t('location')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Fragment>
        </div>
      </Form>
    </BaseDrawer>
  )
}
