import { Fragment, useMemo, useState } from 'react'
import { UIModeEnum } from '@/shared/types'
import { useTranslation } from 'react-i18next'
import { useUIActionLabel } from '@/shared/hooks'
import { Input } from '@/shared/components/ui/input'
import { TerritorialStaffView } from './territorial-staff-view'
import { PhoneInput } from '@/shared/components/ui/phone-input'
import { MultiSelect } from '@/shared/components/ui/multi-select'
import { InputNumber } from '@/shared/components/ui/input-number'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { BaseDrawer } from '@/shared/components/common/base-drawer'
import FormSkeleton from '@/shared/components/common/form-skeleton/ui'
import { useTerritorialStaffsDrawer } from '@/shared/hooks/entity-hooks'
import { useTerritorialStaffForm } from '../model/use-territorial-staff-form'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import DatePicker from '@/shared/components/ui/datepicker'
import { Button } from '@/shared/components/ui/button'
import { format } from 'date-fns'
import { apiClient } from '@/shared/api/api-client'

export const TerritorialStaffDrawer = () => {
  const { t } = useTranslation('common')
  const { isOpen, mode, onClose } = useTerritorialStaffsDrawer()
  const modeState = useUIActionLabel(mode)
  const [isLoading, setIsLoading] = useState(false)

  const {
    form,
    onSubmit,
    isCreate,
    isPending,
    isFetching,
    fetchByIdData,
    userRoleOptions,
    departmentOptions,
    userPermissionOptions,
  } = useTerritorialStaffForm()

  const roleOptions = useMemo(() => getSelectOptions(userRoleOptions), [])

  const pin = form.getValues('pin')
  const birthDate = form.getValues('birthDate')

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
      {mode === UIModeEnum.VIEW ? (
        <TerritorialStaffView data={fetchByIdData as any} />
      ) : (
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              name="pin"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>{t('short.pin')}</FormLabel>
                  <FormControl>
                    <InputNumber maxLength={14} placeholder="142536945201203" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="birthDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Tug‘ilgan sana</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      disableStrategy="after"
                      placeholder="Sanani tanlang"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="button"
                disabled={!pin || !birthDate}
                loading={isLoading}
                onClick={() => {
                  if (pin && birthDate) {
                    const d = format(birthDate, 'yyyy-MM-dd')
                    setIsLoading(true)
                    apiClient
                      .post<{ data: { fullName: string } }>('/integration/iip/individual', {
                        pin,
                        birthDate: d,
                      })
                      .then((res) => {
                        if (res?.data?.data?.fullName) {
                          form.setValue('fullName', res?.data?.data?.fullName)
                        }
                      })
                      .finally(() => {
                        setIsLoading(false)
                      })
                  }
                }}
              >
                Qidirish
              </Button>
            </div>

            {isFetching && !isCreate ? (
              <FormSkeleton length={7} />
            ) : (
              <Fragment>
                <FormField
                  name="fullName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>{t('short.full_name')}</FormLabel>
                      <FormControl>
                        <Input disabled={true} placeholder={t('short.full_name')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/*<FormField*/}
                {/*  name="pin"*/}
                {/*  control={form.control}*/}
                {/*  render={({ field }) => (*/}
                {/*    <FormItem>*/}
                {/*      <FormLabel required>{t('short.pin')}</FormLabel>*/}
                {/*      <FormControl>*/}
                {/*        <InputNumber maxLength={14} placeholder="142536945201203" {...field} />*/}
                {/*      </FormControl>*/}
                {/*      <FormMessage />*/}
                {/*    </FormItem>*/}
                {/*  )}*/}
                {/*/>*/}
                <FormField
                  name="position"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>{t('position')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('position')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="phoneNumber"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Telefon raqami</FormLabel>
                      <FormControl>
                        <PhoneInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="role"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>{t('role')}</FormLabel>
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
                            <SelectValue placeholder={t('role')} />
                          </SelectTrigger>
                          <SelectContent>{roleOptions}</SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="officeId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Hududiy bo'lim</FormLabel>
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
                            <SelectValue placeholder="Hududiy bo'limni tanlang" />
                          </SelectTrigger>
                          <SelectContent>{departmentOptions}</SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="directions"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>{t('directions')}</FormLabel>
                      <FormControl>
                        <MultiSelect
                          {...field}
                          maxDisplayItems={5}
                          placeholder={t('directions')}
                          options={userPermissionOptions}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Fragment>
            )}
          </div>
        </Form>
      )}
    </BaseDrawer>
  )
}
