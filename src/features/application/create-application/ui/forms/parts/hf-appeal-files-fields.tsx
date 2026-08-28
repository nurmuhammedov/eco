import { UseFormReturn } from 'react-hook-form'
import { parseISO } from 'date-fns'
import { FormControl, FormField, FormItem, FormLabel } from '@/shared/components/ui/form'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import DatePicker from '@/shared/components/ui/datepicker'
import { HF_APPEAL_FILE_FIELDS } from '@/entities/create-application/schemas/hf-appeal-files'

interface HfAppealFilesFieldsProps {
  form: UseFormReturn<any>
  /** Field path this set lives under, e.g. `hfAppealFilesDto.3.` */
  prefix: string
  /** An edit does not ask again for the identification card or the fee receipt. */
  requireMandatory?: boolean
}

/**
 * The attachment set for one category. Rendered once per selected category, so
 * it is driven by the field list rather than four hundred lines of repeated
 * JSX - which is also what kept the two HF forms from drifting apart.
 */
export const HfAppealFilesFields = ({ form, prefix, requireMandatory = true }: HfAppealFilesFieldsProps) => (
  <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 2xl:grid-cols-3">
    {HF_APPEAL_FILE_FIELDS.map((item) => {
      const pathName = `${prefix}${item.name}`
      const expiryName = item.expiry ? `${prefix}${item.expiry}` : undefined

      return (
        <div key={item.name} className="border-b pb-4">
          <FormField
            control={form.control}
            name={pathName}
            render={({ field }) => (
              <FormItem className="mb-2">
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                  <FormLabel required={item.required && requireMandatory} className="w-full sm:max-w-1/2 2xl:max-w-3/7">
                    {item.label}
                  </FormLabel>
                  <FormControl>
                    <InputFile
                      form={form}
                      name={field.name}
                      accept={[FileTypes.PDF]}
                      onRemove={
                        expiryName
                          ? () => form.setValue(expiryName, undefined as any, { shouldValidate: true })
                          : undefined
                      }
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          {expiryName && (
            <FormField
              control={form.control}
              name={expiryName}
              render={({ field }) => {
                const value = typeof field.value === 'string' ? parseISO(field.value) : field.value
                const hasFile = !!form.watch(pathName)

                return (
                  <FormItem className="w-full">
                    <div className="mb-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                      <FormLabel required={hasFile}>Amal qilish muddati</FormLabel>
                      <DatePicker
                        className="max-w-2/3"
                        value={value instanceof Date && !isNaN(value.valueOf()) ? value : undefined}
                        onChange={field.onChange}
                        disableStrategy="before"
                        placeholder="Sanani tanlang"
                        disabled={!hasFile}
                      />
                    </div>
                  </FormItem>
                )
              }}
            />
          )}
        </div>
      )
    })}
  </div>
)
