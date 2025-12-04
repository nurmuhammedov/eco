import { SelectItem } from '@/shared/components/ui/select.tsx'
import { OptionItem } from '@/shared/types/general.ts'
import { JSX } from 'react'

export function getSelectOptions<T>(list: OptionItem<T>[]): JSX.Element[] {
  if (!Array.isArray(list) || list.length === 0) {
    return [
      <SelectItem value="notSelected" key="no-options" disabled={true}>
        Mavjud emas
      </SelectItem>,
    ]
  }

  return list
    .map((option) =>
      option?.id ? (
        <SelectItem value={String(option.id)} key={String(option.id) || crypto.randomUUID()}>
          {option.name}
        </SelectItem>
      ) : null
    )
    .filter(Boolean) as JSX.Element[]
}

export function getSelectOptionsByType<T>(list: OptionItem<T>[]): JSX.Element[] {
  if (!Array.isArray(list) || list.length === 0) {
    return [
      <SelectItem value="notSelected" key="no-options" disabled={true}>
        Mavjud emas
      </SelectItem>,
    ]
  }

  return list
    .map((option) =>
      option?.id ? (
        <SelectItem value={String(option.id)} key={String(option.id) || crypto.randomUUID()}>
          {option.name}
        </SelectItem>
      ) : null
    )
    .filter(Boolean) as JSX.Element[]
}
