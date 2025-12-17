import { cn } from '@/shared/lib/utils'
import { Input } from '@/shared/components/ui/input'
import React, { ChangeEvent, forwardRef, InputHTMLAttributes, useCallback, useMemo } from 'react'
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form'

export interface BaseNumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value'> {
  value?: string | undefined
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  min?: number
  max?: number
  step?: number
  allowDecimals?: boolean
  decimalPlaces?: number
  allowNegative?: boolean
}

export type NumberInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = BaseNumberInputProps & UseControllerProps<TFieldValues, TName>

function InputNumber<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: NumberInputProps<TFieldValues, TName>) {
  const {
    name,
    control,
    defaultValue,
    rules,
    shouldUnregister,
    min,
    max,
    step = 1,
    allowDecimals = true,
    decimalPlaces = 2,
    allowNegative = true,
    className,
    disabled,
    ...inputProps
  } = props

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue,
    rules,
    shouldUnregister,
  })

  const validationRegex = useMemo(() => {
    if (allowDecimals) {
      return allowNegative ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/
    }
    return allowNegative ? /^-?\d*$/ : /^\d*$/
  }, [allowDecimals, allowNegative])

  const ariaAttributes = useMemo(
    () => ({
      'aria-valuemin': min,
      'aria-valuemax': max,
      'aria-valuenow': field.value !== undefined ? field.value : undefined,
      'aria-invalid': !!error,
    }),
    [min, max, field.value, error]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value

      if (!newValue) {
        field.onChange(undefined)
        return
      }

      if (validationRegex.test(newValue)) {
        e.target.value = newValue

        const numberValue = parseFloat(newValue)

        if (!isNaN(numberValue)) {
          field.onChange(numberValue)
        } else if (newValue === '-' && allowNegative) {
          e.target.value = '-'
        } else if (newValue === '.' && allowDecimals) {
          e.target.value = '0.'
          field.onChange(0)
        }
      }
    },
    [validationRegex, field, allowNegative, allowDecimals]
  )

  // Fokus yo'qolganda qiymatni formatlash
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      field.onBlur()

      const inputValue = e.target.value

      if (inputValue && inputValue !== '-' && inputValue !== '.') {
        const numberValue = parseFloat(inputValue)

        if (!isNaN(numberValue)) {
          let finalValue = numberValue

          // Cheklovlarni qo'llash
          if (min !== undefined && numberValue < min) {
            finalValue = min
          }

          if (max !== undefined && numberValue > max) {
            finalValue = max
          }

          if (allowDecimals && decimalPlaces !== undefined) {
            finalValue = Number(finalValue.toFixed(decimalPlaces))
          }

          if (finalValue !== numberValue) {
            field.onChange(finalValue)
            e.target.value = finalValue.toString()
          }
        }
      } else if (inputValue === '-' || inputValue === '.' || inputValue === '0.') {
        e.target.value = ''
        field.onChange(undefined)
      }
    },
    [field, min, max, allowDecimals, decimalPlaces]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()

        const inputValue = e.currentTarget.value
        const currentValue = inputValue ? parseFloat(inputValue) : 0
        const stepValue = e.key === 'ArrowUp' ? step : -step
        let newValue = currentValue + stepValue

        if (min !== undefined && newValue < min) {
          newValue = min
        }

        if (max !== undefined && newValue > max) {
          newValue = max
        }

        if (allowDecimals && decimalPlaces !== undefined) {
          newValue = Number(newValue.toFixed(decimalPlaces))
        }

        e.currentTarget.value = newValue.toString()
        field.onChange(newValue)
      }
    },
    [step, min, max, allowDecimals, decimalPlaces, field]
  )

  const formatInputValue = useCallback(() => {
    if (field.value === undefined || field.value === null) {
      return ''
    }
    return field.value.toString()
  }, [field.value])

  return (
    <Input
      {...inputProps}
      {...ariaAttributes}
      className={cn(error && 'border-red-500 focus-visible:ring-red-500', className)}
      name={field.name}
      ref={field.ref}
      type="text"
      inputMode={allowDecimals ? 'decimal' : 'numeric'}
      value={formatInputValue()}
      onChange={handleInputChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      disabled={disabled}
    />
  )
}

const ForwardedNumberInput = forwardRef<HTMLInputElement, BaseNumberInputProps>((props, ref) => {
  return <Input {...props} type="text" ref={ref} />
})
ForwardedNumberInput.displayName = 'InputNumber'

export { InputNumber, ForwardedNumberInput }
