import { Control, Controller } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { Input } from './input'

interface InputCurrencyProps {
  name: string
  control: Control<any>
  placeholder?: string
}

export function InputCurrency({ name, control, placeholder }: InputCurrencyProps) {
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
