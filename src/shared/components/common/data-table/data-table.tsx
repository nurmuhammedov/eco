import * as React from 'react';
import { Fragment } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { cn } from '@/shared/lib/utils';
import { getCommonPinningStyles } from '@/shared/components/common/data-table/models/get-common-pinning';
import {
  DataTablePagination,
  SpringPageResponse,
} from './data-table-pagination';
import { useFilters } from '@/shared/hooks/use-filters';

interface DataTableProps<TData, TValue> {
  // Data can now be a Spring Boot paginated response or a simple array
  data: TData[] | SpringPageResponse<TData>;
  namespace: string;
  className?: string;
  columns: ColumnDef<TData, TValue>[];
  // Optional pagination props
  isPaginated?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  isLoading?: boolean;
  pageSizeOptions?: number[];
  visiblePages?: number;
}

export function DataTable<TData, TValue>({
  data,
  columns,
  className,
  // Pagination props with defaults
  isPaginated = false,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  pageSizeOptions = [10, 20, 50, 100],
  visiblePages = 5,
}: DataTableProps<TData, TValue>) {
  // Determine if we have Spring Boot pagination data
  const isSpringData = data && typeof data === 'object' && 'content' in data;

  // Extract the actual data array to use in the table
  const tableData = isSpringData ? data.content : data;

  // Get pagination info from Spring data if available
  const pageCount = isSpringData ? data.totalPages : undefined;

  // Access the filters context if needed
  const { filters, setFilters } = useFilters();

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Default page handlers if not provided
  const handlePageChange = React.useCallback(
    (page: number) => {
      if (onPageChange) {
        console.log('handlePageChange', page);
        onPageChange(page);
      } else if (isSpringData) {
        console.log('handlePageChange', page, isSpringData);
        // Default implementation using filters
        setFilters({ ...filters, page });
      }
    },
    [filters, setFilters, onPageChange, isSpringData],
  );

  const handlePageSizeChange = React.useCallback(
    (size: number) => {
      if (onPageSizeChange) {
        onPageSizeChange(size);
      } else if (isSpringData) {
        // Default implementation using filters
        setFilters({ ...filters, page: 1, size });
      }
    },
    [filters, setFilters, onPageSizeChange, isSpringData],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    pageCount,
    enableSorting: true,
    manualPagination: isPaginated || isSpringData,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <Fragment>
      <div
        className={cn('relative rounded-md bg-white overflow-auto', className)}
      >
        <Table className="p-2">
          <TableHeader className="p-2 font-semibold text-black">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getCommonPinningStyles({ column: header.column }),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                        ...getCommonPinningStyles({ column: cell.column }),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns?.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Render pagination if data is paginated (Spring format) */}
      {isPaginated && isSpringData && (
        <DataTablePagination
          data={data}
          isLoading={isLoading}
          visiblePages={visiblePages}
          onPageChange={handlePageChange}
          pageSizeOptions={pageSizeOptions}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </Fragment>
  );
}
