import { useCustomSearchParams } from '@/shared/hooks';
import SearchInput from '@/shared/components/common/search-input/ui/search-input';
import { useEffect, useState } from 'react';

function useDebounce(value: any, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const ColumnFilterInput = ({ columnKey }: { columnKey: string }) => {
  const { paramsObject, addParams } = useCustomSearchParams();
  const [value, setValue] = useState(paramsObject[columnKey] || '');
  const dVal = useDebounce(value);

  useEffect(() => {
    addParams({ [columnKey]: dVal, page: 1 });
  }, [dVal]);

  return (
    <SearchInput
      value={value}
      placeholder=""
      onChange={(val) => setValue(val)}
      className="w-full h-8 text-xs bg-white"
      variant="underline"
    />
  );
};
