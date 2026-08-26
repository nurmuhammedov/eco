import { z } from 'zod'
import { format, parseISO } from 'date-fns'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import DatePicker from '@/shared/components/ui/datepicker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Control } from 'react-hook-form'
import { InputNumber } from '@/shared/components/ui/input-number'
import { InputCurrency } from '@/shared/components/ui/input-currency'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'

const { required, invalid } = FORM_ERROR_MESSAGES

const text = () => z.string({ required_error: required, invalid_type_error: invalid }).trim().min(1, required)

/**
 * `z.coerce.number()` turns an empty input into 0, so a blank required field
 * used to pass as a valid zero. InputNumber clears to undefined instead, which
 * a plain number schema rejects.
 */
const numeric = () => z.number({ required_error: required, invalid_type_error: invalid })

const day = () =>
  z.date({ required_error: required, invalid_type_error: invalid }).transform((date) => format(date, 'yyyy-MM-dd'))

export const cadastreDataSchema = z.object({
  name: text(),
  organizationalBelonging: text(),
  address: text(),
  latitude: numeric(),
  longitude: numeric(),
  landCadastreNumber: text(),
  cadastreRegistrationDate: day(),
  cadastreRegistrationNumber: text(),
  landArea: numeric(),
  purpose: text(),
  substance: text(),
  status: text(),
  exploitationDate: day(),
  protectionDistance: text(),
  employeeCount: numeric(),
  workingHour: numeric(),
  distanceToResidence: numeric(),
  distanceToNearestObject: numeric(),
  distanceToFireDepartment: numeric(),
  firefightingEquipment: text(),
  damageArea: numeric(),
  dominantHazardType: text(),
  estimatedValue: numeric(),
  healthRiskFactor: text(),
})

interface CadastreDataFieldsProps {
  control: Control<any>
  prefix?: string
}

export const CadastreDataFields = ({ control, prefix = 'cadastreData.' }: CadastreDataFieldsProps) => {
  return (
    // A container query reads the nearest ancestor container, never the element
    // it sits on - so the grid needs a wrapper to measure against.
    <div className="@container">
      <div className="grid grid-cols-1 gap-x-4 gap-y-5 @lg:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4 @6xl:grid-cols-5 @7xl:grid-cols-6">
        <FormField
          control={control}
          name={`${prefix}name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Obyekt nomi</FormLabel>
              <FormControl>
                <Input placeholder="Kiriting" {...field} />
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
              <FormLabel required>Idoraviy mansubligi</FormLabel>
              <FormControl>
                <Input placeholder="Kiriting" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}address`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Manzil</FormLabel>
              <FormControl>
                <Input placeholder="Kiriting" {...field} />
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
              <FormLabel required>Koordinatasi (X/Kenglik)</FormLabel>
              <FormControl>
                <InputNumber
                  control={control}
                  name={field.name}
                  min={-90}
                  max={90}
                  decimalPlaces={6}
                  allowDecimals
                  placeholder="Kiriting"
                />
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
              <FormLabel required>Koordinatasi (Y/Uzunlik)</FormLabel>
              <FormControl>
                <InputNumber
                  control={control}
                  name={field.name}
                  min={-180}
                  max={180}
                  decimalPlaces={6}
                  allowDecimals
                  placeholder="Kiriting"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}landCadastreNumber`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Yer uchastkasi kadastr raqami</FormLabel>
              <FormControl>
                <Input placeholder="Kiriting" {...field} />
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
                <FormLabel required>Kadastr ro‘yxatidan o‘tkazilgan sana</FormLabel>
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
          name={`${prefix}cadastreRegistrationNumber`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Kadastr ro‘yxatidan o‘tkazilgan raqami</FormLabel>
              <FormControl>
                <Input placeholder="Kiriting" {...field} />
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
              <FormLabel required>Umumiy maydoni (gektar)</FormLabel>
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
          name={`${prefix}purpose`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Vazifalari</FormLabel>
              <FormControl>
                <Input placeholder="Kiriting" {...field} />
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
              <FormLabel required>Moddaning nomi</FormLabel>
              <FormControl>
                <Input placeholder="Kiriting" {...field} />
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
              <FormLabel required>Hozirgi kundagi holati</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Faol</SelectItem>
                    <SelectItem value="INACTIVE">To‘xtatilgan</SelectItem>
                  </SelectContent>
                </Select>
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
                <FormLabel required>Ekspluatatsiyaga tushirilgan sanasi</FormLabel>
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
          name={`${prefix}protectionDistance`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Sanitariya himoyasi masofasi</FormLabel>
              <FormControl>
                <Input placeholder="Kiriting" {...field} />
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
              <FormLabel required>Xodimlarning umumiy soni</FormLabel>
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
              <FormLabel required>Bir sutkada ishlash vaqti (soat)</FormLabel>
              <FormControl>
                {/* Half-shifts are ordinary here, so 2.5 has to be accepted as
                  readily as 8; a day cannot hold more than 24. */}
                <InputNumber
                  control={control}
                  name={field.name}
                  min={0}
                  max={24}
                  step={0.5}
                  allowNegative={false}
                  allowDecimals
                  decimalPlaces={1}
                  placeholder="Masalan: 8 yoki 2.5"
                />
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
              <FormLabel required>Aholi yashash punktigacha masofa (km)</FormLabel>
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
          name={`${prefix}distanceToNearestObject`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Eng yaqin obyektlar (metr)</FormLabel>
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
          name={`${prefix}distanceToFireDepartment`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Yong‘in xavfsizligi bo‘limigacha masofa (km)</FormLabel>
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
          name={`${prefix}firefightingEquipment`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Yong‘in o‘chirish texnikasi</FormLabel>
              <FormControl>
                <Input placeholder="Kiriting" {...field} />
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
              <FormLabel required>Zararlanish maydoni (metr kv)</FormLabel>
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
          name={`${prefix}dominantHazardType`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Ustunlik qiluvchi texnogen xavf turi</FormLabel>
              <FormControl>
                <Input placeholder="Kiriting" {...field} />
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
              <FormLabel required>Umumiy bahosi (so‘m)</FormLabel>
              <FormControl>
                {/* A sum runs to billions here, so it gets the grouped money
                    input rather than a bare number the eye has to count. */}
                <InputCurrency control={control} name={field.name} placeholder="Kiriting" />
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
              <FormLabel required>Salbiy ta’sir ko‘rsatuvchi omillar</FormLabel>
              <FormControl>
                <Input placeholder="Kiriting" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
