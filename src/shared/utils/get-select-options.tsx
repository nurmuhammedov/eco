import { JSX } from 'react';
import { OptionItem } from '@/shared/types/general';
import { SelectItem } from '@/shared/components/ui/select';

export function getSelectOptions<T>(list: OptionItem<T>[]): JSX.Element[] {
  if (!Array.isArray(list) || list.length === 0) {
    return [
      <SelectItem value="null" key="no-options">
        Mavjud emas
      </SelectItem>,
    ];
  }

  return list
    .map((option) =>
      option?.value ? (
        <SelectItem
          value={String(option.value)}
          key={String(option.value) || crypto.randomUUID()}
        >
          {option.label}
        </SelectItem>
      ) : null,
    )
    .filter(Boolean) as JSX.Element[];
}
