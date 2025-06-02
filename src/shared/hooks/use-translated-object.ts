import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export function useTranslatedObject<T extends string>(
  object: Record<string, T>,
  i18nNamespace?: string,
  sorted = false,
): Array<{ id: T; name: string }> {
  const { t } = useTranslation();

  return useMemo(() => {
    const items = Object.values(object).map((value) => ({
      id: value,
      name: i18nNamespace ? t(`${i18nNamespace}.${value}`) : t(value),
    }));

    if (sorted) {
      return [...items].sort((a, b) => a.name.localeCompare(b.name));
    }

    return items;
  }, [object, i18nNamespace, t, sorted]);
}
