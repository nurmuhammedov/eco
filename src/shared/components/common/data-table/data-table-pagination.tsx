import { Table } from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useTableFilters } from '@/shared/lib/use-table-filter';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  namespace: string;
}

export function DataTablePagination<TData>({
  table,
  namespace,
}: DataTablePaginationProps<TData>) {
  const { filters, updateFilter } = useTableFilters(namespace);

  const pageNumber = Number(filters.page);
  const pageSize = Number(filters.pageSize);

  return (
    <div className="flex items-center justify-between">
      <div>10</div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => updateFilter('pageSize', Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span>
          Page {pageNumber} of {table.getPageCount()}
        </span>

        <Button
          variant="outline"
          onClick={() => updateFilter('page', 1)}
          disabled={pageNumber <= 0}
        >
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          onClick={() => updateFilter('page', pageNumber - 1)}
          disabled={pageNumber <= 0}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          onClick={() => updateFilter('page', pageNumber + 1)}
          disabled={pageNumber + 1 >= table.getPageCount()}
        >
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          onClick={() => updateFilter('page', table.getPageCount())}
          disabled={pageNumber + 1 >= table.getPageCount()}
        >
          <ChevronsRight />
        </Button>
      </div>
    </div>
  );
}
