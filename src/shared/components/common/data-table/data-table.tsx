import * as React from 'react';
import { Fragment, useCallback } from 'react';
import { cn } from '@/shared/lib/utils';
import { useFilters } from '@/shared/hooks/use-filters/use-filters.ts';
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
import { ResponseData } from '@/shared/types/api';
import { DataTablePagination } from './data-table-pagination';
import { getCommonPinningStyles } from './models/get-common-pinning';

interface DataTableProps<TData, TValue> {
  namespace: string;
  className?: string;
  isLoading?: boolean;
  isPaginated?: boolean;
  pageSizeOptions?: number[];
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | ResponseData<TData>;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function DataTable<TData, TValue>({
  data,
  columns,
  className,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  isPaginated = false,
  pageSizeOptions,
}: DataTableProps<TData, TValue>) {
  const isContentData = data && typeof data === 'object' && 'content' in data;

  const tableData = isContentData ? data.content : data;

  const pageCount = isContentData ? data?.page?.totalPages : undefined;

  const { filters, setFilters } = useFilters();

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (onPageChange) {
        onPageChange(page);
      } else if (isContentData) {
        setFilters({ ...filters, page });
      }
    },
    [filters, setFilters, onPageChange, isContentData],
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      if (onPageSizeChange) {
        onPageSizeChange(size);
      } else if (isContentData) {
        setFilters({ ...filters, page: 1, size });
      }
    },
    [filters, setFilters, onPageSizeChange, isContentData],
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
    manualPagination: isPaginated || isContentData,
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

      {isPaginated && isContentData && (
        <DataTablePagination
          data={data}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          pageSizeOptions={pageSizeOptions}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </Fragment>
  );
}
