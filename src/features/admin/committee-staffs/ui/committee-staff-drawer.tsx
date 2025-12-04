import { Fragment, useMemo, useState } from 'react'
import { UIModeEnum } from '@/shared/types'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/components/ui/input'
import { useUIActionLabel } from '@/shared/hooks'
import { CommitteeStaffView } from './committee-staff-view'
import { PhoneInput } from '@/shared/components/ui/phone-input'
import { InputNumber } from '@/shared/components/ui/input-number'
import { MultiSelect } from '@/shared/components/ui/multi-select'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { BaseDrawer } from '@/shared/components/common/base-drawer'
import FormSkeleton from '@/shared/components/common/form-skeleton/ui'
import { useCommitteeStaffsDrawer } from '@/shared/hooks/entity-hooks'
import { useCommitteeStaffForm } from '../model/use-committee-staff-form'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Button } from '@/shared/components/ui/button'
import DatePicker from '@/shared/components/ui/datepicker'
import { apiClient } from '@/shared/api'
import { format } from 'date-fns'

export const CommitteeStaffDrawer = () => {
  const { t } = useTranslation('common')
  const { isOpen, mode, onClose } = useCommitteeStaffsDrawer()
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
  } = useCommitteeStaffForm()

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
        <CommitteeStaffView data={fetchByIdData as any} />
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
                  <FormLabel required={isCreate}>Tug‘ilgan sana</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value ?? undefined}
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
                  name="departmentId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Qo'mita va departament</FormLabel>
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
                            <SelectValue placeholder="Qo'mita yoki departamentni tanlang" />
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
