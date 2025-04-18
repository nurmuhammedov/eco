import { JSX } from 'react';
import { OptionItem } from '@/shared/types/general.ts';
import { SelectItem } from '@/shared/components/ui/select.tsx';

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
      option?.id ? (
        <SelectItem value={String(option.id)} key={String(option.id) || crypto.randomUUID()}>
          {option.name}
        </SelectItem>
      ) : null,
    )
    .filter(Boolean) as JSX.Element[];
}
