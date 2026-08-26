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

        <div className="grid grid-cols-1 gap-x-4 gap-y-5 @lg:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4 @6xl:grid-cols-5 @7xl:grid-cols-6">
          {group.fields.map((item) => (
            <FormField
              key={item.name}
              control={control}
              name={`${prefix}${item.name}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{item.label}</FormLabel>
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
