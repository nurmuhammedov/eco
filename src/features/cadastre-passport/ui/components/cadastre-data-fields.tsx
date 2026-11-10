import { z } from 'zod'
import { MapPin, Plus, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import DatePicker from '@/shared/components/ui/datepicker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useEffect } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import type { OptionItem } from '@/shared/types/general'
import { InputNumber } from '@/shared/components/ui/input-number'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { SelectOrInput } from '@/shared/components/ui/select-or-input'
import { Combobox } from '@/shared/components/ui/combobox'
import { useDistrictSelectQuery, useRegionSelectQuery } from '@/shared/api/dictionaries'
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
  BELONGING_TYPES,
  COORDINATE_LENGTH,
  COORDINATE_PATTERN,
  LAND_CADASTRE_NUMBER_LENGTH,
  LAND_CADASTRE_NUMBER_PATTERN,
  LAND_CADASTRE_NUMBER_SAMPLE,
  LATITUDE_SAMPLE,
  LONGITUDE_SAMPLE,
  TXYUZ_DOMINANT_HAZARD_TYPES,
  TXYUZ_HAZARD_LEVELS,
  TXYUZ_HEALTH_RISK_FACTORS,
  TXYUZ_FIREFIGHTING_EQUIPMENT,
  TXYUZ_PROTECTION_DISTANCES,
  TXYUZ_PURPOSES,
  TXYUZ_SUBSTANCES,
  formatCoordinate,
  formatLandCadastreNumber,
  joinAddress,
  mapLinks,
} from '../../model/txyuz-options'

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

/** The year the object was put into service; the backend keeps it as text */
const year = () =>
  z
    .string({ required_error: required, invalid_type_error: invalid })
    .regex(/^\d{4}$/, required)
    .refine((value) => Number(value) <= new Date().getFullYear(), invalid)

/** Newest first: most objects are recent, and the list can still be searched */
const EXPLOITATION_YEARS = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, index) => {
  const value = String(new Date().getFullYear() - index)
  return { id: value, name: value }
})

/** A whole count of things - people, extinguishers, floors. */
const whole = () => numeric().int(invalid)

/**
 * The order follows "ТХЮЗ маълумоти", the sheet this form is filled in from.
 * Four of its rows have no column on the endpoint yet - the legal address (3),
 * the taxpayer number (7), the hazard type (15) and the number of extinguishers
 * (19) - so they are left out until the backend carries them.
 */
const cadastreObjectSchema = z
  .object({
    name: text(),
    /** Joined into `organizationalBelonging` on the way out. */
    belongingName: text(),
    belongingType: text(),
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
    cadastreRegistrationNumber: text(),
    cadastreRegistrationDate: day(),
    landCadastreNumber: text().regex(LAND_CADASTRE_NUMBER_PATTERN, invalid),
    landArea: numeric(),
    exploitationYear: year(),
    purpose: text(),
    substance: text(),
    hazardLevel: text(),
    employeeCount: whole(),
    workingHour: whole().min(1, invalid).max(24, invalid),
    firefightingEquipment: text(),
    fireEquipmentCount: whole().min(0, invalid),
    distanceToFireDepartment: numeric(),
    dominantHazardType: text(),
    damageArea: numeric(),
    healthRiskFactor: text(),
    distanceToNearestObject: numeric(),
    protectionDistance: text(),
    distanceToResidence: numeric(),
    estimatedValue: numeric(),
    status: text(),
  })
  .transform(
    ({
      regionId: _regionId,
      districtId: _districtId,
      regionName,
      districtName,
      addressLine,
      belongingName,
      belongingType,
      ...rest
    }) => ({
      ...rest,
      organizationalBelonging: `${belongingName.trim()} ${belongingType}`,
      address: joinAddress(regionName, districtName, addressLine),
    })
  )

/**
 * One passport covers one or more objects; the registry sheet and the
 * organisation's own belonging and address are filled in once per passport.
 */
export const cadastreDataSchema = z
  .object({
    objects: z.array(cadastreObjectSchema).min(1, required),
    /** Titul varag'i: idoraviy mansublik (joined into `organizationalBelonging`, as on an object) va manzil. */
    belongingName: text(),
    belongingType: text(),
    address: text(),
    /**
     * Titulning «Obyektning joylashgan manzili» qatori. The endpoint takes it as
     * one string, `addressLine`, and the title splits that on its first two
     * commas into viloyat, tuman and the rest - so it is collected the way an
     * object's address is and joined on the way out.
     */
    locationRegionId: text(),
    locationRegionName: text(),
    locationDistrictId: text(),
    locationDistrictName: text(),
    locationAddressLine: text(),
    // "TXYZ kadastr pasporti davlat reyestridan o‘tkazilganligi to‘g‘risida ma’lumotlar" - the
    // second sheet of the passport, filled in by the same customer.
    stateRegistryCertNumber: text(),
    stateRegistryCertDate: day(),
    // ixtiyoriy: litsenziyasi yo'q obyektlar ham bor
    licenseNumber: z
      .string()
      .trim()
      .optional()
      .transform((value) => value || undefined),
    licenseDate: day().optional(),
    okpo: text().regex(OKPO_PATTERN, invalid),
    bankMfo: text().regex(BANK_MFO_PATTERN, invalid),
    phoneNumber: text().regex(USER_PATTERNS.phone),
  })
  .transform(
    ({
      belongingName,
      belongingType,
      locationRegionId: _locationRegionId,
      locationDistrictId: _locationDistrictId,
      locationRegionName,
      locationDistrictName,
      locationAddressLine,
      ...rest
    }) => ({
      ...rest,
      organizationalBelonging: `${belongingName.trim()} ${belongingType}`,
      addressLine: joinAddress(locationRegionName, locationDistrictName, locationAddressLine),
    })
  )

/** The fields sit on whichever form wraps them, under `prefix` */
interface CadastreDataFieldsProps {
  prefix?: string
}

const nameById = (list: OptionItem<number>[] | undefined, id: string) =>
  (list ?? []).find((item) => String(item.id) === String(id))?.name ?? ''

const idByName = (list: OptionItem<number>[] | undefined, name: string) => {
  const match = (list ?? []).find((item) => String(item.name).trim() === String(name).trim())

  return match ? String(match.id) : ''
}

/**
 * Obyektning idoraviy mansubligi, on an object and on the registry sheet alike.
 * One field to the eye: the name is typed, the kind of body is picked beside
 * it, and both leave as one string.
 */
const BelongingField = ({ prefix }: { prefix: string }) => {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={`${prefix}belongingName`}
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Obyektning idoraviy mansubligi</FormLabel>
          <div className="flex items-start">
            <FormControl>
              <Input
                placeholder="Kiriting"
                maxLength={200}
                className="rounded-r-none"
                {...field}
                value={field.value ?? ''}
              />
            </FormControl>
            <FormField
              control={control}
              name={`${prefix}belongingType`}
              render={({ field: typeField }) => (
                <FormItem className="w-48 shrink-0 space-y-0">
                  <Select value={typeField.value || ''} onValueChange={typeField.onChange}>
                    <FormControl>
                      <SelectTrigger className="rounded-l-none border-l-0">
                        <SelectValue placeholder="Tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BELONGING_TYPES.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

/** Form keys of one address, the labels of its two lists and how long its last part may be */
interface AddressConfig {
  regionId: string
  regionName: string
  districtId: string
  districtName: string
  line: string
  regionLabel: string
  districtLabel: string
  lineMaxLength: number
}

/** An object's own address, under the keys its block has always had */
const OBJECT_ADDRESS: AddressConfig = {
  regionId: 'regionId',
  regionName: 'regionName',
  districtId: 'districtId',
  districtName: 'districtName',
  line: 'addressLine',
  regionLabel: 'Viloyat',
  districtLabel: 'Tuman',
  lineMaxLength: 255,
}

/**
 * The passport's own location, for the title. Its keys are its own: the
 * endpoint calls the joined string `addressLine`, which on an object is only
 * the street. The lists are named for it as well - next to the legal address a
 * bare «Viloyat» reads as that address's region. The rest of the line is kept
 * short enough for the joined string to fit a 255-character column.
 */
const LOCATION_ADDRESS: AddressConfig = {
  regionId: 'locationRegionId',
  regionName: 'locationRegionName',
  districtId: 'locationDistrictId',
  districtName: 'locationDistrictName',
  line: 'locationAddressLine',
  regionLabel: 'Obyekt joylashgan viloyat',
  districtLabel: 'Obyekt joylashgan tuman',
  lineMaxLength: 190,
}

/**
 * Viloyat and tuman picked from the lists, the rest typed. The record keeps the
 * joined string only, so an existing one arrives with the names: the selects
 * run on ids, and each name is matched back to one as soon as its list is
 * loaded.
 */
const AddressFields = ({ prefix, config }: { prefix: string; config: AddressConfig }) => {
  const { control, setValue } = useFormContext()

  const regionIdKey = `${prefix}${config.regionId}`
  const regionNameKey = `${prefix}${config.regionName}`
  const districtIdKey = `${prefix}${config.districtId}`
  const districtNameKey = `${prefix}${config.districtName}`

  const regionId = useWatch({ control, name: regionIdKey })
  const districtId = useWatch({ control, name: districtIdKey })
  const regionName = useWatch({ control, name: regionNameKey })
  const districtName = useWatch({ control, name: districtNameKey })

  const { data: regions } = useRegionSelectQuery()
  const { data: districts } = useDistrictSelectQuery(Number(regionId))

  useEffect(() => {
    if (regionId || !regionName) return

    const match = idByName(regions, regionName)
    if (match) setValue(regionIdKey, match, { shouldValidate: false })
  }, [regionId, regionName, regions, regionIdKey, setValue])

  useEffect(() => {
    if (!regionId || districtId || !districtName) return

    const match = idByName(districts, districtName)
    if (match) setValue(districtIdKey, match, { shouldValidate: false })
  }, [regionId, districtId, districtName, districts, districtIdKey, setValue])

  return (
    <>
      <FormField
        control={control}
        name={regionIdKey}
        render={({ field }) => (
          <FormItem>
            <FormLabel required>{config.regionLabel}</FormLabel>
            <FormControl>
              <Select
                value={field.value || ''}
                onValueChange={(value) => {
                  field.onChange(value)
                  setValue(regionNameKey, nameById(regions, value), { shouldValidate: false })
                  setValue(districtIdKey, '', { shouldValidate: false })
                  setValue(districtNameKey, '', { shouldValidate: false })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {(regions ?? []).map((region) => (
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
        name={districtIdKey}
        render={({ field }) => (
          <FormItem>
            <FormLabel required>{config.districtLabel}</FormLabel>
            <FormControl>
              <Select
                value={field.value || ''}
                disabled={!regionId}
                onValueChange={(value) => {
                  field.onChange(value)
                  setValue(districtNameKey, nameById(districts, value), { shouldValidate: false })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {(districts ?? []).map((district) => (
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
        name={`${prefix}${config.line}`}
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Obyektning joylashgan manzili (MFY, ko‘chasi, uy raqami)</FormLabel>
            <FormControl>
              <Input placeholder="Kiriting" maxLength={config.lineMaxLength} {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

export const CadastreDataFields = ({ prefix = 'cadastreData.' }: CadastreDataFieldsProps) => {
  const { control } = useFormContext()

  const latitude = useWatch({ control, name: `${prefix}latitude` })
  const longitude = useWatch({ control, name: `${prefix}longitude` })
  const links = mapLinks(String(latitude ?? ''), String(longitude ?? ''))

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
        <BelongingField prefix={prefix} />
        <AddressFields prefix={prefix} config={OBJECT_ADDRESS} />
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
              {/* Once both axes are whole, the point can be checked on a map
                  without leaving the form. */}
              <div className="relative">
                <FormControl>
                  <Input
                    placeholder={LATITUDE_SAMPLE}
                    inputMode="decimal"
                    maxLength={COORDINATE_LENGTH}
                    className={links ? 'pr-36' : undefined}
                    {...field}
                    value={field.value ?? ''}
                    onChange={(event) => field.onChange(formatCoordinate(event.target.value))}
                  />
                </FormControl>
                {links && (
                  <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                    <a
                      href={links.google}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Google Maps’da ko‘rish"
                      className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs"
                    >
                      <MapPin className="size-3" />
                      Google
                    </a>
                    <a
                      href={links.yandex}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Yandex Kartada ko‘rish"
                      className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs"
                    >
                      <MapPin className="size-3" />
                      Yandex
                    </a>
                  </div>
                )}
              </div>
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
                <Input placeholder="Kiriting" maxLength={255} {...field} value={field.value ?? ''} />
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
          name={`${prefix}exploitationYear`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektning ekspluatatsiya qilingan yili</FormLabel>
              <FormControl>
                <Combobox
                  options={EXPLOITATION_YEARS}
                  value={field.value ? String(field.value) : null}
                  onChange={(value) => field.onChange(String(value))}
                  placeholder="Yilni tanlang"
                  searchPlaceholder="Yilni qidirish"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}purpose`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektning vazifasi</FormLabel>
              <FormControl>
                <SelectOrInput options={TXYUZ_PURPOSES} value={field.value} onChange={field.onChange} />
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
                <SelectOrInput options={TXYUZ_SUBSTANCES} value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}hazardLevel`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Xavflilik darajasi</FormLabel>
              <FormControl>
                <SelectOrInput options={TXYUZ_HAZARD_LEVELS} value={field.value} onChange={field.onChange} />
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
                <SelectOrInput options={TXYUZ_FIREFIGHTING_EQUIPMENT} value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}fireEquipmentCount`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektda yong‘in o‘chirish vositasining soni (ta)</FormLabel>
              <FormControl>
                <InputNumber control={control} name={field.name} min={0} allowNegative={false} placeholder="Kiriting" />
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
                <SelectOrInput options={TXYUZ_DOMINANT_HAZARD_TYPES} value={field.value} onChange={field.onChange} />
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
                <SelectOrInput options={TXYUZ_HEALTH_RISK_FACTORS} value={field.value} onChange={field.onChange} />
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
              <FormLabel required>Obyektning sanitariya muhofaza zonasi (m)</FormLabel>
              <FormControl>
                <SelectOrInput options={TXYUZ_PROTECTION_DISTANCES} value={field.value} onChange={field.onChange} />
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

/** An empty object block - the schema only has to hold at submit time. */
export const emptyCadastreObject = () => ({}) as z.input<typeof cadastreObjectSchema>

/** The block's number and, once chosen, the object's purpose - so blocks are told apart without opening them up. */
const ObjectHeading = ({ prefix, index }: { prefix: string; index: number }) => {
  const { control } = useFormContext()
  const purpose = useWatch({ control, name: `${prefix}purpose` })

  return (
    <h6 className="text-sm font-semibold text-gray-700">
      {index + 1}-obyekt{purpose ? ` – ${purpose}` : ''}
    </h6>
  )
}

/**
 * Every object of the passport gets its own block of the sheet's fields; the
 * first one is always there, the rest can be added and removed.
 */
export const CadastreObjectsFields = ({ prefix = 'cadastreData.' }: CadastreDataFieldsProps) => {
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({ control, name: `${prefix}objects` })

  return (
    <div className="space-y-4">
      {fields.map((item, index) => (
        <div key={item.id} className="rounded-xl border border-neutral-200 p-4">
          <div className="mb-4 flex items-center justify-between">
            <ObjectHeading prefix={`${prefix}objects.${index}.`} index={index} />
            {fields.length > 1 && (
              <Button type="button" variant="ghost" size="sm" className="text-red-600" onClick={() => remove(index)}>
                <Trash2 className="size-4" />
                O‘chirish
              </Button>
            )}
          </div>
          <CadastreDataFields prefix={`${prefix}objects.${index}.`} />
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => append(emptyCadastreObject())}>
        <Plus className="size-4" />
        Obyekt qo‘shish
      </Button>
    </div>
  )
}

/**
 * The passport's second sheet - what the state registry and the licence say
 * about the organisation. It is part of the same `preparerData` object, so it
 * shares the prefix; only the accordion it sits in is separate.
 */
export const CadastreRegistryFields = ({ prefix = 'cadastreData.' }: CadastreDataFieldsProps) => {
  const { control } = useFormContext()

  return (
    <div className="@container">
      <div className="grid grid-cols-1 items-end gap-x-4 gap-y-5 @2xl:grid-cols-2 @5xl:grid-cols-3">
        <BelongingField prefix={prefix} />
        <FormField
          control={control}
          name={`${prefix}address`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyektning yuridik manzili</FormLabel>
              <FormControl>
                <Input placeholder="Kiriting" maxLength={255} {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <AddressFields prefix={prefix} config={LOCATION_ADDRESS} />
        <FormField
          control={control}
          name={`${prefix}stateRegistryCertNumber`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>
                Obyektning davlat ro‘yxatidan o‘tkazilganligi to‘g‘risidagi guvohnoma raqami
              </FormLabel>
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
              <FormLabel>Obyektning litsenziya raqami</FormLabel>
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
                <FormLabel>Obyektning litsenziya sanasi</FormLabel>
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
}
