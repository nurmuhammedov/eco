import { Fragment, useState } from 'react'
import { UIModeEnum } from '@/shared/types'
import { useTranslation } from 'react-i18next'
import { useUIActionLabel } from '@/shared/hooks'
import { Input } from '@/shared/components/ui/input'
import { TerritorialStaffView } from './territorial-staff-view'
import { PhoneInput } from '@/shared/components/ui/phone-input'
import { MultiSelect } from '@/shared/components/ui/multi-select'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { BaseDrawer } from '@/shared/components/common/base-drawer'
import FormSkeleton from '@/shared/components/common/form-skeleton/ui'
import { useTerritorialStaffsDrawer } from '@/shared/hooks/entity-hooks'
import { useTerritorialStaffForm } from '../model/use-territorial-staff-form'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import DatePicker from '@/shared/components/ui/datepicker'
import { Button } from '@/shared/components/ui/button'
import { lookupCitizen } from '@/shared/api/citizen-lookup'

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
    officeName,
    userRoleOptions,
    departmentOptions,
    userPermissionOptions,
  } = useTerritorialStaffForm()

  const roleOptions = getSelectOptions(userRoleOptions)

  const [pin, birthDate] = form.watch(['pin', 'birthDate'])

  const searchName = async () => {
    if (!pin || !birthDate) return
    setIsLoading(true)
    const citizen = await lookupCitizen(pin, birthDate)
    setIsLoading(false)
    if (citizen?.fullName) form.setValue('fullName', citizen.fullName, { shouldValidate: true })
  }

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
        <TerritorialStaffView data={fetchByIdData} officeName={officeName} />
      ) : (
        <Form {...form}>
          <div className="space-y-4">
            {isCreate && (
              <Fragment>
                <FormField
                  name="pin"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>{t('short.pin')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          inputMode="numeric"
                          maxLength={14}
                          placeholder="12345678901234"
                          onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                        />
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
                    onClick={() => void searchName()}
                  >
                    Qidirish
                  </Button>
                </div>
              </Fragment>
            )}

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
                      <FormLabel required>Hududiy bo‘lim</FormLabel>
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
                            <SelectValue placeholder="Hududiy bo‘limni tanlang" />
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
