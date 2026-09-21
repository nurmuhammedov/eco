import { z } from 'zod'
import { format, parseISO } from 'date-fns'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import DatePicker from '@/shared/components/ui/datepicker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useEffect } from 'react'
import { Control, useFormContext, useWatch } from 'react-hook-form'
import { InputNumber } from '@/shared/components/ui/input-number'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { SelectOrInput } from '@/shared/components/ui/select-or-input'
import { useDistrictsSelectQuery, useRegionSelectQuery } from '@/entities/admin/districts'
import { PhoneInput } from '@/shared/components/ui/phone-input'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import {
  BANK_MFO_LENGTH,
  BANK_MFO_PATTERN,
  LICENSE_NUMBER_SAMPLE,
  OKPO_LENGTH,
  OKPO_PATTERN,
  STATE_REGISTRY_CERT_NUMBER_SAMPLE,
  onlyDigits,
  CERTIFICATE_NUMBER_LENGTH,
  CERTIFICATE_NUMBER_PATTERN,
  CERTIFICATE_NUMBER_SAMPLE,
  COORDINATE_LENGTH,
  COORDINATE_PATTERN,
  LAND_CADASTRE_NUMBER_LENGTH,
  LAND_CADASTRE_NUMBER_PATTERN,
  LAND_CADASTRE_NUMBER_SAMPLE,
  LATITUDE_SAMPLE,
  LONGITUDE_SAMPLE,
  TXYZ_DOMINANT_HAZARD_TYPES,
  TXYZ_FIREFIGHTING_EQUIPMENT,
  TXYZ_PROTECTION_DISTANCES,
  TXYZ_PURPOSES,
  TXYZ_SUBSTANCES,
  formatCertificateNumber,
  formatCoordinate,
  formatLandCadastreNumber,
} from '../../model/txyz-options'

const { required, invalid } = FORM_ERROR_MESSAGES

const text = () => z.string({ required_error: required, invalid_type_error: invalid }).trim().min(1, required)

/**
 * `z.coerce.number()` turns an empty input into 0, so a blank required field
 * used to pass as a valid zero. InputNumber clears to undefined instead, which
 * a plain number schema rejects.
 */
const numeric = () => z.number({ required_error: required, invalid_type_error: invalid })

/** Text on the form so the dot can be typed, a number on the way out. */
const coordinate = () =>
  z
    .string({ required_error: required, invalid_type_error: invalid })
    .trim()
    .min(1, required)
    .regex(COORDINATE_PATTERN, invalid)
    .transform(Number)

const day = () =>
  z.date({ required_error: required, invalid_type_error: invalid }).transform((date) => format(date, 'yyyy-MM-dd'))

/** A whole count of things - people, extinguishers, floors. */
const whole = () => numeric().int(invalid)

/**
 * The order follows "ТХЮЗ маълумоти", the sheet this form is filled in from.
 * Four of its rows have no column on the endpoint yet - the legal address (3),
 * the taxpayer number (7), the hazard type (15) and the number of extinguishers
 * (19) - so they are left out until the backend carries them.
 */
export const cadastreDataSchema = z
  .object({
    name: text(),
    organizationalBelonging: text(),
    /**
     * The endpoint keeps one address string and no region or district of its
     * own, so the three parts are collected here and joined on the way out.
     */
    regionId: text(),
    regionName: text(),
    districtId: text(),
    districtName: text(),
    addressLine: text(),
    longitude: coordinate(),
    latitude: coordinate(),
    cadastreRegistrationNumber: text().regex(CERTIFICATE_NUMBER_PATTERN, invalid),
    cadastreRegistrationDate: day(),
    landCadastreNumber: text().regex(LAND_CADASTRE_NUMBER_PATTERN, invalid),
    landArea: numeric(),
    exploitationDate: day(),
    purpose: text(),
    substance: text(),
    employeeCount: whole(),
    workingHour: whole().min(1, invalid).max(24, invalid),
    firefightingEquipment: text(),
    distanceToFireDepartment: numeric(),
    dominantHazardType: text(),
    damageArea: numeric(),
    healthRiskFactor: text(),
    distanceToNearestObject: numeric(),
    protectionDistance: text(),
    distanceToResidence: numeric(),
    estimatedValue: numeric(),
    status: text(),
    // "Davlat reestridan o‘tkazilgan obyekt to‘g‘risida ma’lumotlar" - the
    // second sheet of the passport, filled in by the same customer.
    stateRegistryCertNumber: text(),
    stateRegistryCertDate: day(),
    licenseNumber: text(),
    licenseDate: day(),
    okpo: text().regex(OKPO_PATTERN, invalid),
    bankMfo: text().regex(BANK_MFO_PATTERN, invalid),
    phoneNumber: text().regex(USER_PATTERNS.phone, FORM_ERROR_MESSAGES.phone),
  })
  .transform(({ regionId: _regionId, districtId: _districtId, regionName, districtName, addressLine, ...rest }) => ({
    ...rest,
    address: [regionName, districtName, addressLine]
      .map((part) => part?.trim())
      .filter(Boolean)
      .join(', '),
  }))

interface CadastreDataFieldsProps {
  control: Control<any>
  prefix?: string
}

const nameById = (list: any[] | undefined, id: string) =>
  (list ?? []).find((item: any) => String(item.id) === String(id))?.name ?? ''

const idByName = (list: any[] | undefined, name: string) => {
  const match = (list ?? []).find((item: any) => String(item.name).trim() === String(name).trim())

  return match ? String(match.id) : ''
}

export const CadastreDataFields = ({ control, prefix = 'cadastreData.' }: CadastreDataFieldsProps) => {
  const { setValue } = useFormContext()

  const regionId = useWatch({ control, name: `${prefix}regionId` })
  const districtId = useWatch({ control, name: `${prefix}districtId` })

  const regionName = useWatch({ control, name: `${prefix}regionName` })
  const districtName = useWatch({ control, name: `${prefix}districtName` })

  const { data: regions } = useRegionSelectQuery()
  const { data: districts } = useDistrictsSelectQuery(Number(regionId))

  /**
   * An existing record arrives with the names only - the address it was saved
   * as. The selects run on ids, so each name is matched back to one as soon as
   * its list is loaded.
   */
  useEffect(() => {
    if (regionId || !regionName) return

    const match = idByName(regions, regionName)
    if (match) setValue(`${prefix}regionId`, match, { shouldValidate: false })
  }, [regionId, regionName, regions, prefix, setValue])

  useEffect(() => {
    if (!regionId || districtId || !districtName) return

    const match = idByName(districts, districtName)
    if (match) setValue(`${prefix}districtId`, match, { shouldValidate: false })
  }, [regionId, districtId, districtName, districts, prefix, setValue])

  return (
    // A container query reads the nearest ancestor container, never the element
    // it sits on - so the grid needs a wrapper to measure against.
    <div className="@container">
      {/* The labels are whole sentences from the sheet, so the cells have to be
          wide; `items-end` keeps every input in a row on one line however many
          lines its label takes. */}
      <div className="grid grid-cols-1 items-end gap-x-4 gap-y-5 @2xl:grid-cols-2 @5xl:grid-cols-3">
        <FormField
          control={control}
          name={`${prefix}name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektning nomi</FormLabel>
              <FormControl>
                <Input placeholder="Kiriting" maxLength={255} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}organizationalBelonging`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektning idoraviy mansubligi</FormLabel>
              <FormControl>
                <Input placeholder="Kiriting" maxLength={255} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}regionId`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Viloyat</FormLabel>
              <FormControl>
                <Select
                  value={field.value || ''}
                  onValueChange={(value) => {
                    field.onChange(value)
                    setValue(`${prefix}regionName`, nameById(regions, value), { shouldValidate: false })
                    setValue(`${prefix}districtId`, '', { shouldValidate: false })
                    setValue(`${prefix}districtName`, '', { shouldValidate: false })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {(regions ?? []).map((region: any) => (
                      <SelectItem key={region.id} value={String(region.id)}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}districtId`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Tuman</FormLabel>
              <FormControl>
                <Select
                  value={field.value || ''}
                  disabled={!regionId}
                  onValueChange={(value) => {
                    field.onChange(value)
                    setValue(`${prefix}districtName`, nameById(districts, value), { shouldValidate: false })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {(districts ?? []).map((district: any) => (
                      <SelectItem key={district.id} value={String(district.id)}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}addressLine`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektning joylashgan manzili</FormLabel>
              <FormControl>
                <Input placeholder="Kiriting" maxLength={255} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}longitude`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektning X koordinatasi</FormLabel>
              <FormControl>
                <Input
                  placeholder={LONGITUDE_SAMPLE}
                  inputMode="decimal"
                  maxLength={COORDINATE_LENGTH}
                  {...field}
                  value={field.value ?? ''}
                  onChange={(event) => field.onChange(formatCoordinate(event.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}latitude`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektning Y koordinatasi</FormLabel>
              <FormControl>
                <Input
                  placeholder={LATITUDE_SAMPLE}
                  inputMode="decimal"
                  maxLength={COORDINATE_LENGTH}
                  {...field}
                  value={field.value ?? ''}
                  onChange={(event) => field.onChange(formatCoordinate(event.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}cadastreRegistrationNumber`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>
                Obyektning yer uchastkasini kadastr ro‘yxatidan o‘tkazilgan guvohnoma raqami
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={CERTIFICATE_NUMBER_SAMPLE}
                  maxLength={CERTIFICATE_NUMBER_LENGTH}
                  {...field}
                  value={field.value ?? ''}
                  onChange={(event) => field.onChange(formatCertificateNumber(event.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}cadastreRegistrationDate`}
          render={({ field }) => {
            const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
            return (
              <FormItem>
                <FormLabel required>
                  Obyektning yer uchastkasini kadastr ro‘yxatidan o‘tkazilgan guvohnoma sanasi
                </FormLabel>
                <DatePicker
                  value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                  onChange={field.onChange}
                  placeholder="Sanani tanlang"
                  disableStrategy="after"
                />
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={control}
          name={`${prefix}landCadastreNumber`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektning yer uchastkasi kadastr raqami</FormLabel>
              <FormControl>
                <Input
                  placeholder={LAND_CADASTRE_NUMBER_SAMPLE}
                  inputMode="numeric"
                  maxLength={LAND_CADASTRE_NUMBER_LENGTH}
                  {...field}
                  value={field.value ?? ''}
                  onChange={(event) => field.onChange(formatLandCadastreNumber(event.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}landArea`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektning yer uchastkasi maydoni (gektar)</FormLabel>
              <FormControl>
                <InputNumber
                  control={control}
                  name={field.name}
                  min={0}
                  allowNegative={false}
                  allowDecimals
                  decimalPlaces={4}
                  placeholder="Kiriting"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}exploitationDate`}
          render={({ field }) => {
            const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
            return (
              <FormItem>
                <FormLabel required>Obyektning ekspluatatsiya qilingan sanasi</FormLabel>
                <DatePicker
                  value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                  onChange={field.onChange}
                  placeholder="Sanani tanlang"
                  disableStrategy="after"
                />
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={control}
          name={`${prefix}purpose`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektning vazifasi</FormLabel>
              <FormControl>
                <SelectOrInput options={TXYZ_PURPOSES} value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}substance`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>
                Obyektda ishlab chiqarish, qayta ishlash, saqlash va foydalanish moddasining nomi
              </FormLabel>
              <FormControl>
                <SelectOrInput options={TXYZ_SUBSTANCES} value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}employeeCount`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektda xodimlarning soni (ta)</FormLabel>
              <FormControl>
                <InputNumber
                  control={control}
                  name={field.name}
                  allowDecimals={false}
                  allowNegative={false}
                  placeholder="Kiriting"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}workingHour`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektda bir sutka davomida xodimlarning ishlash vaqti (soat)</FormLabel>
              <FormControl>
                <InputNumber
                  control={control}
                  name={field.name}
                  min={1}
                  max={24}
                  allowNegative={false}
                  allowDecimals={false}
                  placeholder="Kiriting"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}firefightingEquipment`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektda yong‘in o‘chirish vositasining turi</FormLabel>
              <FormControl>
                <SelectOrInput options={TXYZ_FIREFIGHTING_EQUIPMENT} value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}distanceToFireDepartment`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektdan yong‘in-qutqaruv qismigacha bo‘lgan masofa (km)</FormLabel>
              <FormControl>
                <InputNumber
                  control={control}
                  name={field.name}
                  min={0}
                  allowNegative={false}
                  allowDecimals
                  decimalPlaces={3}
                  placeholder="Kiriting"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}dominantHazardType`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektda texnogen xavf rivojlanishida ustunlik qiluvchi turi</FormLabel>
              <FormControl>
                <SelectOrInput options={TXYZ_DOMINANT_HAZARD_TYPES} value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}damageArea`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektda texnogen xavf sodir bo‘lganda zararlanish maydoni (m²)</FormLabel>
              <FormControl>
                <InputNumber
                  control={control}
                  name={field.name}
                  min={0}
                  allowNegative={false}
                  allowDecimals
                  decimalPlaces={2}
                  placeholder="Kiriting"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}healthRiskFactor`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>
                Obyektda texnogen xavf sodir bo‘lganda inson salomatligi uchun salbiy ta’sir ko‘rsatuvchi omillari
              </FormLabel>
              <FormControl>
                <Input placeholder="Kiriting" maxLength={255} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}distanceToNearestObject`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektdan eng yaqin bo‘lgan boshqa obyektgacha bo‘lgan masofa (metr)</FormLabel>
              <FormControl>
                <InputNumber
                  control={control}
                  name={field.name}
                  min={0}
                  allowNegative={false}
                  allowDecimals
                  decimalPlaces={2}
                  placeholder="Kiriting"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}protectionDistance`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektning sanitariya muhofaza zonasi (metr)</FormLabel>
              <FormControl>
                <SelectOrInput options={TXYZ_PROTECTION_DISTANCES} value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}distanceToResidence`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektdan aholi yashash punktigacha bo‘lgan masofa (km)</FormLabel>
              <FormControl>
                <InputNumber
                  control={control}
                  name={field.name}
                  min={0}
                  allowNegative={false}
                  allowDecimals
                  decimalPlaces={3}
                  placeholder="Kiriting"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}estimatedValue`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektning sug‘urtalangan miqdori bahosi (mln so‘m)</FormLabel>
              <FormControl>
                <InputNumber
                  control={control}
                  name={field.name}
                  min={0}
                  allowNegative={false}
                  allowDecimals
                  decimalPlaces={2}
                  placeholder="Kiriting"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}status`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektning hozirgi kundagi holati</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Ishchi holatida</SelectItem>
                    <SelectItem value="INACTIVE">Vaqtinchalik ishsiz holatida</SelectItem>
                    <SelectItem value="PRESERVATION">Konservatsiya holatida</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

/**
 * The passport's second sheet - what the state registry and the licence say
 * about the organisation. It is part of the same `preparerData` object, so it
 * shares the prefix; only the accordion it sits in is separate.
 */
export const CadastreRegistryFields = ({ control, prefix = 'cadastreData.' }: CadastreDataFieldsProps) => (
  <div className="@container">
    <div className="grid grid-cols-1 items-end gap-x-4 gap-y-5 @2xl:grid-cols-2 @5xl:grid-cols-3">
      <FormField
        control={control}
        name={`${prefix}stateRegistryCertNumber`}
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Obyektning davlat ro‘yxatidan o‘tkazilganligi to‘g‘risidagi guvohnoma raqami</FormLabel>
            <FormControl>
              <Input
                placeholder={STATE_REGISTRY_CERT_NUMBER_SAMPLE}
                maxLength={50}
                {...field}
                value={field.value ?? ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${prefix}stateRegistryCertDate`}
        render={({ field }) => {
          const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
          return (
            <FormItem>
              <FormLabel required>
                Obyektning davlat ro‘yxatidan o‘tkazilganligi to‘g‘risidagi guvohnoma sanasi
              </FormLabel>
              <DatePicker
                value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                onChange={field.onChange}
                placeholder="Sanani tanlang"
                disableStrategy="after"
              />
              <FormMessage />
            </FormItem>
          )
        }}
      />
      <FormField
        control={control}
        name={`${prefix}licenseNumber`}
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Obyektning litsenziya raqami</FormLabel>
            <FormControl>
              <Input placeholder={LICENSE_NUMBER_SAMPLE} maxLength={50} {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${prefix}licenseDate`}
        render={({ field }) => {
          const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
          return (
            <FormItem>
              <FormLabel required>Obyektning litsenziya sanasi</FormLabel>
              <DatePicker
                value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                onChange={field.onChange}
                placeholder="Sanani tanlang"
                disableStrategy="after"
              />
              <FormMessage />
            </FormItem>
          )
        }}
      />
      <FormField
        control={control}
        name={`${prefix}okpo`}
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Korxona va tashkilotning umumdavlat tasnifi raqami (KTUT, OKPO)</FormLabel>
            <FormControl>
              <Input
                placeholder="25648237"
                inputMode="numeric"
                maxLength={OKPO_LENGTH}
                {...field}
                value={field.value ?? ''}
                onChange={(event) => field.onChange(onlyDigits(event.target.value, OKPO_LENGTH))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${prefix}bankMfo`}
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Filiallararo aylanma pul muomalalarining xos raqami (YBK, MFO)</FormLabel>
            <FormControl>
              <Input
                placeholder="00440"
                inputMode="numeric"
                maxLength={BANK_MFO_LENGTH}
                {...field}
                value={field.value ?? ''}
                onChange={(event) => field.onChange(onlyDigits(event.target.value, BANK_MFO_LENGTH))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${prefix}phoneNumber`}
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Telefon raqami</FormLabel>
            <FormControl>
              <PhoneInput {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  </div>
)
