import { cn } from '@/shared/lib/utils'
import { Input } from '@/shared/components/ui/input'
import React, { ChangeEvent, forwardRef, InputHTMLAttributes, useCallback, useMemo, useState } from 'react'
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

  /**
   * What is on screen while typing, which is not always what the form holds.
   * "2." parses to 2, and rendering the parsed number back would swallow the
   * dot the moment it is typed - making decimals impossible to enter at all.
   * The draft holds those in-between states and is dropped on blur.
   */
  const [draft, setDraft] = useState<string | null>(null)

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value

      // Reject the keystroke rather than the whole value: a stray letter should
      // leave what was already typed alone.
      if (newValue && !validationRegex.test(newValue)) return

      setDraft(newValue)

      if (!newValue) {
        field.onChange(undefined)
        return
      }

      const numberValue = parseFloat(newValue)
      field.onChange(isNaN(numberValue) ? undefined : numberValue)
    },
    [validationRegex, field]
  )

  // Fokus yo'qolganda qiymatni formatlash
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      field.onBlur()

      const inputValue = e.target.value
      const numberValue = parseFloat(inputValue)

      // Dropping the draft hands the display back to the form value, so the
      // clamped and rounded number is what the user is left looking at.
      setDraft(null)

      if (isNaN(numberValue)) {
        field.onChange(undefined)
        return
      }

      let finalValue = numberValue

      if (min !== undefined && finalValue < min) finalValue = min
      if (max !== undefined && finalValue > max) finalValue = max
      if (allowDecimals && decimalPlaces !== undefined) finalValue = Number(finalValue.toFixed(decimalPlaces))

      if (finalValue !== numberValue) field.onChange(finalValue)
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

        // The arrows produce a settled number, so the draft has nothing to hold.
        setDraft(null)
        field.onChange(newValue)
      }
    },
    [step, min, max, allowDecimals, decimalPlaces, field]
  )

  const formatInputValue = useCallback(() => {
    if (draft !== null) return draft
    if (field.value === undefined || field.value === null) return ''

    return String(field.value)
  }, [draft, field.value])

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
