import { SelectItem } from '@/shared/components/ui/select'
import { OptionItem } from '@/shared/types/general'
import { JSX } from 'react'

/** The category list names its entries `3.1`, `3.2` and explains each in `description`. */
interface HazardousFacilityTypeOption extends OptionItem<number> {
  description?: string
}

export function getSelectOptions<T>(list: OptionItem<T>[] | undefined): JSX.Element[] {
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
        option?.registryNumber ? (
          <SelectItem value={String(option.id)} key={String(option.id) || crypto.randomUUID()}>
            {option?.registryNumber} - {option.name}
          </SelectItem>
        ) : (
          <SelectItem value={String(option.id)} key={String(option.id) || crypto.randomUUID()}>
            {option.name}
          </SelectItem>
        )
      ) : null
    )
    .filter(Boolean) as JSX.Element[]
}

export function getSelectOptionsByType<T>(list: OptionItem<T>[] | undefined): JSX.Element[] {
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

export function getHazardousFacilityTypeOptions(list: HazardousFacilityTypeOption[] | undefined): JSX.Element[] {
  if (!Array.isArray(list) || list.length === 0) {
    return [
      <SelectItem value="notSelected" key="no-options" disabled={true}>
        Mavjud emas
      </SelectItem>,
    ]
  }

  return list
    .filter((option) => ['3.1', '3.2', '3.3'].includes(option.name))
    .map((option) => (
      <SelectItem value={String(option.id)} key={String(option.id)}>
        <span
          className="block py-1 leading-tight break-words whitespace-normal"
          title={`${option.name} - ${option.description}`}
        >
          <strong>{option.name}</strong> - {option.description}
        </span>
      </SelectItem>
    ))
}
