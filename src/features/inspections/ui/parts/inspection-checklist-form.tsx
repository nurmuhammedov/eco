import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Textarea } from '@/shared/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
  ChecklistAnswerStatus,
  ChecklistFormValues,
  checklistFormSchema,
} from '../../model/inspection-checklist.schema'
import { useCustomSearchParams } from '@/shared/hooks'
import { formatDate, parseISO } from 'date-fns'
import DatePicker from '@/shared/components/ui/datepicker'
import InspectionChecklistModal from '@/features/inspections/ui/parts/inspection-checklist-modal'

interface InspectionChecklistFormProps {
  items: any[]
  onSuccess?: () => void
}

export const answerOptions = [
  {
    value: ChecklistAnswerStatus.POSITIVE,
    labelKey: 'Bajarilgan',
  },
  {
    value: ChecklistAnswerStatus.NEGATIVE,
    labelKey: 'Bajarilmagan',
  },
  {
    value: ChecklistAnswerStatus.UNRELATED,
    labelKey: 'Tadbiq etilmaydi',
  },
]

export const InspectionChecklistForm = ({ items }: InspectionChecklistFormProps) => {
  const { t } = useTranslation()
  const { addParams } = useCustomSearchParams()
  const form = useForm<ChecklistFormValues>({
    resolver: zodResolver(checklistFormSchema),
    defaultValues: {
      items: items.map((item) => ({
        id: item.id,
        question: item.question,
        orderNumber: item.orderNumber,
        answer: undefined,
        description: '',
        deadline: undefined,
        file: null,
      })),
    },
  })

  const { fields } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  const categoryTitle = items.length > 0 ? items[0].categoryTypeName : ''

  const handleFormSubmit = (_: ChecklistFormValues) => {
    addParams({ modal: 'addUsers' })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-6 pb-3">
        {categoryTitle && <h3 className="text-xl font-semibold">{categoryTitle}</h3>}

        {fields.map((field, index) => (
          <Card key={field.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                {index + 1}. {field.question}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name={`items.${index}.answer`}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{t('common:answer', 'Javob')}:</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-row flex-wrap items-center gap-x-6 gap-y-2"
                      >
                        {answerOptions.map((option) => (
                          <FormItem key={option.value} className="flex items-center space-y-0 space-x-2">
                            <FormControl>
                              <RadioGroupItem value={option.value} />
                            </FormControl>
                            <FormLabel className="font-normal">{t(option.labelKey)}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch(`items.${index}.answer`) === ChecklistAnswerStatus.NEGATIVE && (
                <>
                  <FormField
                    control={form.control}
                    name={`items.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Chora-tadbir matni', 'Chora-tadbir matni')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('Chora-tadbir matnni kiriting...', 'Chora-tadbir matnni kiriting...')}
                            {...field}
                            value={field?.value || ('' as unknown as string)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.deadline`}
                    render={({ field }) => {
                      const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                      return (
                        <FormItem className="w-full">
                          <FormLabel required>Bartaraf etish muddati</FormLabel>
                          <DatePicker
                            value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                            onChange={field.onChange}
                            placeholder="Bartaraf etish muddatini belgilash"
                          />
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                </>
              )}
            </CardContent>
          </Card>
        ))}

        <InspectionChecklistModal
          items={form?.watch('items')?.map((item) => ({
            question: item.question,
            answer: item.answer,
            orderNumber: item.orderNumber,
            corrective: item.answer == ChecklistAnswerStatus.NEGATIVE ? item.description || null : null,
            deadline:
              item.answer == ChecklistAnswerStatus.NEGATIVE
                ? item?.deadline
                  ? formatDate(item?.deadline, 'yyyy-MM-dd')
                  : null
                : null,
          }))}
        />

        <Button type="submit" className="self-end">
          {t('common:submit', 'Yuborish')}
        </Button>
      </form>
    </Form>
  )
}
