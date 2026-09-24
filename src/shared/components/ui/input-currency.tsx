import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { Input } from './input'

interface InputCurrencyProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  placeholder?: string
}

export function InputCurrency<T extends FieldValues>({ name, control, placeholder }: InputCurrencyProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, onBlur, ref } }) => (
        <NumericFormat
          value={value ?? ''}
          onValueChange={(values) => {
            onChange(values.floatValue ?? null)
          }}
          thousandSeparator=" "
          decimalSeparator="."
          decimalScale={2}
          fixedDecimalScale={true}
          allowNegative={false}
          placeholder={placeholder}
          customInput={Input}
          onBlur={onBlur}
          getInputRef={ref}
        />
      )}
    />
  )
}
