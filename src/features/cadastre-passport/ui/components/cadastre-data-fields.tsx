import { z } from 'zod'
import { format, parseISO } from 'date-fns'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import DatePicker from '@/shared/components/ui/datepicker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Control } from 'react-hook-form'

export const cadastreDataSchema = z.object({
  name: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  organizationalBelonging: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  address: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  latitude: z.coerce.number({ required_error: 'Majburiy maydon!' }),
  longitude: z.coerce.number({ required_error: 'Majburiy maydon!' }),
  landCadastreNumber: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  cadastreRegistrationDate: z
    .date({ required_error: 'Majburiy maydon!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  cadastreRegistrationNumber: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  landArea: z.coerce.number({ required_error: 'Majburiy maydon!' }),
  purpose: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  substance: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  status: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  exploitationDate: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  protectionDistance: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  employeeCount: z.coerce.number({ required_error: 'Majburiy maydon!' }),
  workingHour: z.coerce.number({ required_error: 'Majburiy maydon!' }),
  distanceToResidence: z.coerce.number({ required_error: 'Majburiy maydon!' }),
  distanceToNearestObject: z.coerce.number({ required_error: 'Majburiy maydon!' }),
  distanceToFireDepartment: z.coerce.number({ required_error: 'Majburiy maydon!' }),
  firefightingEquipment: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  damageArea: z.coerce.number({ required_error: 'Majburiy maydon!' }),
  dominantHazardType: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  estimatedValue: z.coerce.number({ required_error: 'Majburiy maydon!' }),
  healthRiskFactor: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
})

interface CadastreDataFieldsProps {
  control: Control<any>
  prefix?: string
}

export const CadastreDataFields = ({ control, prefix = 'cadastreData.' }: CadastreDataFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              <Input type="number" step="any" placeholder="Kiriting" {...field} />
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
              <Input type="number" step="any" placeholder="Kiriting" {...field} />
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
              <FormLabel required>Kadastr ro'yxatidan o'tkazilgan sana</FormLabel>
              <DatePicker
                value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                onChange={field.onChange}
                placeholder="Sanani tanlang"
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
            <FormLabel required>Kadastr ro'yxatidan o'tkazilgan raqami</FormLabel>
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
              <Input type="number" step="any" placeholder="Kiriting" {...field} />
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
                  <SelectItem value="ACTIVE">Faol (ACTIVE)</SelectItem>
                  <SelectItem value="INACTIVE">To'xtatilgan (INACTIVE)</SelectItem>
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
              <Input type="number" placeholder="Kiriting" {...field} />
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
            <FormLabel required>Ishlash vaqti (sutka/soat)</FormLabel>
            <FormControl>
              <Input type="number" step="any" placeholder="Kiriting" {...field} />
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
              <Input type="number" step="any" placeholder="Kiriting" {...field} />
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
              <Input type="number" step="any" placeholder="Kiriting" {...field} />
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
            <FormLabel required>Yong'in xavfsizligi bo'limigacha masofa (km)</FormLabel>
            <FormControl>
              <Input type="number" step="any" placeholder="Kiriting" {...field} />
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
            <FormLabel required>Yong'in o'chirish texnikasi</FormLabel>
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
              <Input type="number" step="any" placeholder="Kiriting" {...field} />
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
            <FormLabel required>Umumiy bahosi (so'm)</FormLabel>
            <FormControl>
              <Input type="number" step="any" placeholder="Kiriting" {...field} />
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
            <FormLabel required>Salbiy ta'sir ko'rsatuvchi omillar</FormLabel>
            <FormControl>
              <Input placeholder="Kiriting" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
