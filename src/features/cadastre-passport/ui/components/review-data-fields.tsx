import { Control } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import DatePicker from '@/shared/components/ui/datepicker'
import { InputNumber } from '@/shared/components/ui/input-number'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { ReviewGroup } from '../../model/review-fields'

interface ReviewDataFieldsProps {
  control: Control<any>
  groups: ReviewGroup[]
  prefix?: string
}

export const ReviewDataFields = ({ control, groups, prefix = '' }: ReviewDataFieldsProps) => (
  <div className="@container space-y-6">
    {groups.map((group) => (
      <section key={group.title}>
        <h3 className="mb-4 text-base leading-snug font-semibold text-neutral-900">{group.title}</h3>

        {/* Wide cells rather than many narrow ones: these labels are whole
            sentences, and a six-column grid wrapped them three lines deep. */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-5 @2xl:grid-cols-2 @4xl:grid-cols-3 @6xl:grid-cols-4">
          {group.fields.map((item) => (
            <FormField
              key={item.name}
              control={control}
              name={`${prefix}${item.name}`}
              render={({ field }) => (
                // The cell fills the row so the control can sit at its bottom:
                // a label that wraps then grows upwards and leaves every input
                // in the row on the same line.
                <FormItem className="h-full">
                  <FormLabel>{item.label}</FormLabel>
                  <div className="mt-auto">
                    {item.type === 'date' ? (
                      <DatePicker
                        value={field.value instanceof Date && !isNaN(field.value.valueOf()) ? field.value : undefined}
                        onChange={field.onChange}
                        placeholder="Sanani tanlang"
                        // 'after' bars the future, 'before' bars the past.
                        disableStrategy={item.dates === 'past' ? 'after' : item.dates === 'future' ? 'before' : 'none'}
                      />
                    ) : item.type === 'select' ? (
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value ?? ''}>
                          <SelectTrigger>
                            <SelectValue placeholder="Tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            {item.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    ) : item.type === 'text' ? (
                      <FormControl>
                        <Input placeholder="Kiriting" {...field} value={field.value ?? ''} />
                      </FormControl>
                    ) : (
                      <FormControl>
                        <InputNumber
                          control={control}
                          name={field.name}
                          placeholder="Kiriting"
                          allowNegative={false}
                          allowDecimals={item.type === 'decimal'}
                        />
                      </FormControl>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      </section>
    ))}
  </div>
)
