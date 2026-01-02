import { FilterField, FilterRow } from '@/shared/components/common/filters'
import DatePicker from '@/shared/components/ui/datepicker'
import { Form, FormField, FormItem } from '@/shared/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useCustomSearchParams } from '@/shared/hooks'
import { format, getQuarter } from 'date-fns'
import React, { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'

const QUARTERS = [
  { id: '1', name: '1-chorak' },
  { id: '2', name: '2-chorak' },
  { id: '3', name: '3-chorak' },
  { id: '4', name: '4-chorak' },
]

interface ApplicationFiltersFormValues {
  startDate?: Date
  endDate?: Date
  year?: string
  quarter?: string
}

interface ApplicationFiltersProps {
  inputKeys: (keyof ApplicationFiltersFormValues)[]
  className?: string
}

const Filter: React.FC<ApplicationFiltersProps> = ({ inputKeys, className = 'mb-3' }) => {
  const { paramsObject, addParams } = useCustomSearchParams()

  const currentYear = new Date().getFullYear().toString()
  const currentQuarter = getQuarter(new Date()).toString()

  const form = useForm<ApplicationFiltersFormValues>({
    defaultValues: {
      startDate: paramsObject.startDate ? new Date(paramsObject.startDate) : undefined,
      endDate: paramsObject.endDate ? new Date(paramsObject.endDate) : undefined,
      year: paramsObject.year?.toString() || currentYear,
      quarter: paramsObject.quarter?.toString() || currentQuarter,
    },
  })

  const { control, handleSubmit, setValue, watch } = form
  const selectedYear = watch('year')

  // Yil o'zgarganda chorakni joriy chorakka qaytarish (default holat)
  useEffect(() => {
    if (selectedYear) {
      setValue('quarter', currentQuarter)
    }
  }, [selectedYear, setValue, currentQuarter])

  const yearOptions = useMemo(() => {
    const startYear = 2025
    const endYear = new Date().getFullYear() + 1
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => (startYear + i).toString())
  }, [])

  const onSubmit = (data: ApplicationFiltersFormValues) => {
    const formattedData: any = { ...data }
    if (data.startDate) {
      formattedData.startDate = format(data.startDate, 'yyyy-MM-dd')
    }
    if (data.endDate) {
      formattedData.endDate = format(data.endDate, 'yyyy-MM-dd')
    }

    addParams(formattedData, 'page')
  }

  const customDisabledFn = (date: Date) => {
    const startDate = watch('startDate')
    if (!startDate) return false
    const d = new Date(startDate)
    d.setHours(0, 0, 0, 0)
    return date < d
  }

  const renderInput = (key: keyof ApplicationFiltersFormValues) => {
    switch (key) {
      case 'startDate':
        return (
          <FilterField key={key} className="3xl:w-auto w-auto min-w-60 flex-1">
            <FormField
              control={control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <DatePicker
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(date)
                        const endDate = form.getValues('endDate')
                        if (endDate && date && endDate < date) {
                          form.setValue('endDate', undefined)
                        }
                        handleSubmit(onSubmit)()
                      }}
                      placeholder="dan"
                    />
                    {field.value && (
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange(undefined)
                          handleSubmit(onSubmit)()
                        }}
                        className="absolute top-1/2 right-12 -translate-y-1/2 text-gray-400 hover:text-red-500"
                      >
                        ✖
                      </button>
                    )}
                  </div>
                </FormItem>
              )}
            />
          </FilterField>
        )

      case 'endDate':
        return (
          <FilterField key={key} className="3xl:w-auto w-auto min-w-60 flex-1">
            <FormField
              control={control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <DatePicker
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(date)
                        handleSubmit(onSubmit)()
                      }}
                      placeholder="gacha"
                      disableStrategy="custom"
                      customDisabledFn={customDisabledFn}
                      minDate={watch('startDate')}
                    />
                    {field.value && (
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange(undefined)
                          handleSubmit(onSubmit)()
                        }}
                        className="absolute top-1/2 right-12 -translate-y-1/2 text-gray-400 hover:text-red-500"
                      >
                        ✖
                      </button>
                    )}
                  </div>
                </FormItem>
              )}
            />
          </FilterField>
        )

      case 'year':
        return (
          <FilterField key={key} className="3xl:w-auto w-auto max-w-80 flex-1">
            <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    handleSubmit(onSubmit)()
                  }}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Yilni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FilterField>
        )

      case 'quarter':
        return (
          <FilterField key={key} className="3xl:w-auto w-auto max-w-80 flex-1">
            <Controller
              name="quarter"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    handleSubmit(onSubmit)()
                  }}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chorakni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {QUARTERS.map((q) => (
                      <SelectItem key={q.id} value={q.id}>
                        {q.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FilterField>
        )

      default:
        return null
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        <FilterRow className="scrollbar-hidden flex justify-between gap-4 overflow-x-auto overflow-y-hidden">
          {inputKeys.map((key) => renderInput(key))}
        </FilterRow>
      </form>
    </Form>
  )
}

export default Filter
