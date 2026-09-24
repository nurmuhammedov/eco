import { parseISO } from 'date-fns'
import { UseFormReturn } from 'react-hook-form'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/model/file-types'
import DatePicker from '@/shared/components/ui/datepicker'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { PhoneInput } from '@/shared/components/ui/phone-input'

/**
 * Fields every equipment registration form asks for in the same words. Each was
 * written out once per form, which is how the copies came to differ: the same
 * field carried up to six spellings across the seventeen forms.
 */
interface FieldProps {
  form: UseFormReturn<any>
}

const asDate = (value: unknown) => {
  const parsed = typeof value === 'string' ? parseISO(value) : value

  return parsed instanceof Date && !isNaN(parsed.valueOf()) ? parsed : undefined
}

export const PhoneNumberField = ({ form }: FieldProps) => (
  <FormField
    control={form.control}
    name="phoneNumber"
    render={({ field }) => (
      <FormItem>
        <FormLabel required>Telefon raqami</FormLabel>
        <FormControl>
          <PhoneInput className="3xl:w-sm w-full" placeholder="+998 XX XXX XX XX" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)

export const ManufacturedAtField = ({ form }: FieldProps) => (
  <FormField
    control={form.control}
    name="manufacturedAt"
    render={({ field }) => (
      <FormItem className="3xl:w-sm w-full">
        <FormLabel required>Ishlab chiqarilgan sana</FormLabel>
        <DatePicker
          disableStrategy="after"
          value={asDate(field.value)}
          onChange={field.onChange}
          placeholder="Ishlab chiqarilgan sana"
        />
        <FormMessage />
      </FormItem>
    )}
  />
)

export const ServicePeriodField = ({ form }: FieldProps) => (
  <FormField
    control={form.control}
    name="servicePeriod"
    render={({ field }) => (
      <FormItem className="3xl:w-sm w-full">
        <FormLabel required>Xizmat muddati</FormLabel>
        <DatePicker value={asDate(field.value)} onChange={field.onChange} placeholder="Sanani tanlang" />
        <FormMessage />
      </FormItem>
    )}
  />
)

/**
 * A document to attach: a label on the left, the picker on the right. The forms
 * ask for fourteen of these between them and each was written out in full, so
 * the same document ended up with several spellings of its own name.
 */
export const DocumentField = ({
  form,
  name,
  label,
  required = false,
}: FieldProps & { name: string; label: string; required?: boolean }) => (
  <FormField
    name={name}
    control={form.control}
    render={({ field }) => (
      <FormItem className="mb-2">
        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
          <FormLabel required={required} className="w-full sm:max-w-1/2 2xl:max-w-3/7">
            {label}
          </FormLabel>
          <FormControl>
            <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
          </FormControl>
        </div>
      </FormItem>
    )}
  />
)
