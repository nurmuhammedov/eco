import type { JSX } from 'react'
import { parseISO } from 'date-fns'
import type { Path, UseFormReturn } from 'react-hook-form'
import {
  CardForm,
  isTankerFileRequired,
  TANKER_FILES,
  TankerAppealDtoSchema,
  tankerRequires,
} from '@/entities/create-application'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/model/file-types'
import { YandexMapModal } from '@/shared/components/common/yandex-map-modal'
import DatePicker from '@/shared/components/ui/datepicker'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import type { FormDraft } from '@/shared/lib/zod-form-resolver'
import { PhoneNumberField } from './equipment-fields'

/** Every field of a tanker as the forms hold them; the unofficial form adds the owner */
type TankerDraft = FormDraft<typeof TankerAppealDtoSchema>

/** The fields the part reads to decide what to show */
type TankerFieldsShape = { childType?: string; numberPlate?: string }

interface TankerFieldsProps<T extends TankerFieldsShape, TSubmitted> {
  form: UseFormReturn<T, unknown, TSubmitted>
  isUpdate?: boolean
  showPhone?: boolean
  showHazardousFacility?: boolean
  hazardousFacilitiesOptions: JSX.Element[]
  childTypeOptions: JSX.Element[]
  regionOptions: JSX.Element[]
  districtOptions: JSX.Element[]
}

const asDate = (value: unknown) => {
  const parsed = typeof value === 'string' ? parseISO(value) : value
  return parsed instanceof Date && !isNaN(parsed.valueOf()) ? parsed : undefined
}

const fieldClass = '3xl:w-sm w-full'

/**
 * The tanker fields both forms share: the vehicle and its tank, then the
 * documents. What only some kinds must give shows once such a kind is picked,
 * and stays while it holds a value, so nothing hidden can block the form.
 */
export const TankerFields = <T extends TankerFieldsShape, TSubmitted>({
  form,
  isUpdate = false,
  showPhone = false,
  showHazardousFacility = false,
  hazardousFacilitiesOptions,
  childTypeOptions,
  regionOptions,
  districtOptions,
}: TankerFieldsProps<T, TSubmitted>) => {
  // RHF cannot resolve the field names on a form whose values are still a type
  // parameter; the part works through the tanker fields, which both forms hold.
  const tanker = form as unknown as UseFormReturn<TankerDraft>
  const values = tanker.watch()
  const childType = values.childType
  const requires = tankerRequires(childType)
  const isShown = (name: keyof TankerDraft, isRequired: boolean) => isRequired || !!values[name]

  const textField = (name: Path<TankerDraft>, label: string, placeholder = label) => (
    <FormField
      control={tanker.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel required>{label}</FormLabel>
          <FormControl>
            <Input
              className={fieldClass}
              placeholder={placeholder}
              {...field}
              value={typeof field.value === 'string' ? field.value : ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  const dateField = (name: Path<TankerDraft>, label: string, required: boolean, past = true) => (
    <FormField
      control={tanker.control}
      name={name}
      render={({ field }) => (
        <FormItem className={fieldClass}>
          <FormLabel required={required}>{label}</FormLabel>
          <DatePicker
            disableStrategy={past ? 'after' : undefined}
            value={asDate(field.value)}
            onChange={field.onChange}
            placeholder="Sanani tanlang"
          />
          <FormMessage />
        </FormItem>
      )}
    />
  )

  const files = TANKER_FILES.filter(
    (file) =>
      file.always ||
      file.path === 'expertisePath' ||
      isShown(file.path, isTankerFileRequired(file, childType, values.servicePeriod)) ||
      (!!file.expiry && !!values[file.expiry])
  )

  return (
    <>
      <CardForm className="mb-2">
        <div className="3xl:flex 3xl:flex-wrap 4xl:w-5/5 mb-5 grid gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
          {showPhone && <PhoneNumberField form={tanker} />}

          {showHazardousFacility && (
            <FormField
              control={tanker.control}
              name="hazardousFacilityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>XICHO tanlang</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        if (value) field.onChange(value)
                      }}
                      value={field.value || ''}
                    >
                      <SelectTrigger className={fieldClass}>
                        <SelectValue placeholder="XICHOni tanlang (ixtiyoriy)" />
                      </SelectTrigger>
                      <SelectContent>{hazardousFacilitiesOptions}</SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={tanker.control}
            name="childType"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Sig‘im turi</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      if (value) field.onChange(value)
                    }}
                    value={field.value || ''}
                  >
                    <SelectTrigger className={fieldClass}>
                      <SelectValue placeholder="Sig‘im turini tanlang" />
                    </SelectTrigger>
                    <SelectContent>{childTypeOptions}</SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={tanker.control}
            name="numberPlate"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Davlat raqami belgisi</FormLabel>
                <FormControl>
                  <Input
                    className={fieldClass}
                    placeholder="Masalan: 01A123BC"
                    maxLength={12}
                    {...field}
                    value={field.value ?? ''}
                    // Stored without spaces and in capitals, the way the backend keeps it
                    onChange={(event) => field.onChange(event.target.value.replace(/\s+/g, '').toUpperCase())}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {textField('model', 'Avtotransport vositasi modeli (model, marka)', 'Model, marka')}
          {textField('factoryNumber', 'Sig‘imning zavod raqami')}
          {textField('factory', 'Ishlab chiqargan zavod nomi')}
          {textField('capacity', 'Hajmi (m³)', 'Hajmi')}
          {textField('environment', 'Muhit')}
          {textField('pressure', 'Ruxsat etilgan bosim (MPa)', 'Ruxsat etilgan bosim')}

          {isShown('partialCheckDate', requires.partialCheckDate) &&
            dateField('partialCheckDate', 'Ichki ko‘rik o‘tkazilgan sana', requires.partialCheckDate)}
          {isShown('fullCheckDate', requires.fullCheckDate) &&
            dateField('fullCheckDate', 'Gidravlik sinov o‘tkazilgan sana', requires.fullCheckDate)}
          {isShown('nonDestructiveCheckDate', requires.nonDestructiveCheckDate) &&
            dateField(
              'nonDestructiveCheckDate',
              'Oxirgi o‘tkazilgan putur yetkazmaydigan nazorat sanasi',
              requires.nonDestructiveCheckDate
            )}
          {dateField('servicePeriod', 'Xizmat muddati', true, false)}

          <FormField
            control={tanker.control}
            name="regionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Sig‘im joylashgan viloyat</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      if (value) {
                        field.onChange(value)
                        tanker.setValue('districtId', '')
                      }
                    }}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger className={fieldClass}>
                      <SelectValue placeholder="Viloyatni tanlang" />
                    </SelectTrigger>
                    <SelectContent>{regionOptions}</SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={tanker.control}
            name="districtId"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Sig‘im joylashgan tuman</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      if (value) field.onChange(value)
                    }}
                    value={field.value?.toString()}
                    disabled={!values.regionId}
                  >
                    <SelectTrigger className={fieldClass}>
                      <SelectValue placeholder="Tumanni tanlang" />
                    </SelectTrigger>
                    <SelectContent>{districtOptions}</SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {textField('address', 'Sig‘im joylashgan manzil', 'Manzil')}
          <FormField
            control={tanker.control}
            name="location"
            render={({ field }) => (
              <FormItem className={fieldClass}>
                <FormLabel required>Geolokatsiya (xaritadan joyni tanlang)</FormLabel>
                <FormControl>
                  <YandexMapModal
                    initialCoords={field.value ? field.value.split(',').map(Number) : null}
                    onConfirm={(coords) => field.onChange(coords)}
                    label="Xaritadan belgilash"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardForm>

      <CardForm className="mb-5 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 2xl:grid-cols-3">
        {files.map((file) => {
          const expiry = file.expiry
          const hasFile = !!values[file.path]

          return (
            <div key={file.path} className="border-b pb-4">
              <FormField
                name={file.path}
                control={tanker.control}
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                      <FormLabel
                        required={isTankerFileRequired(file, childType, values.servicePeriod)}
                        className="w-full sm:max-w-1/2 2xl:max-w-3/7"
                      >
                        {file.label}
                      </FormLabel>
                      <FormControl>
                        <InputFile
                          form={tanker}
                          name={field.name}
                          accept={file.image ? [FileTypes.IMAGE, FileTypes.PDF] : [FileTypes.PDF]}
                          onRemove={
                            expiry ? () => tanker.setValue(expiry, undefined, { shouldValidate: true }) : undefined
                          }
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              {expiry && (
                <FormField
                  control={tanker.control}
                  name={expiry}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <div className="mb-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                        <FormLabel required={hasFile}>{file.expiryLabel ?? 'Amal qilish muddati'}</FormLabel>
                        <DatePicker
                          className="max-w-2/3"
                          value={asDate(field.value)}
                          onChange={field.onChange}
                          disableStrategy={isUpdate ? undefined : 'before'}
                          placeholder="Sanani tanlang"
                          disabled={!hasFile}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )
        })}
      </CardForm>
    </>
  )
}
