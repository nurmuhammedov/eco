import Icon from '@/shared/components/common/icon';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { useCustomSearchParams } from '@/shared/hooks';
import { cn } from '@/shared/lib/utils';
import { ResponseData } from '@/shared/types/api';
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
import * as React from 'react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTablePagination } from './data-table-pagination';
import { getCommonPinningStyles } from './models/get-common-pinning';
import { useSearchParams } from 'react-router-dom';
import { ColumnFilterInput } from '@/shared/components/common/data-table/column-filter-input';

export type ExtendedColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  filterKey?: string;
  filterType?: 'search' | 'select' | 'date';
};

interface DataTableProps<TData, TValue> {
  className?: string;
  isLoading?: boolean;
  isPaginated?: boolean;
  pageQuery?: 'page' | 'p';
  sizeQuery?: string;
  headerCenter?: boolean;
  pageSizeOptions?: number[];
  // columns: ColumnDef<TData, TValue>[];
  columns: ExtendedColumnDef<TData, TValue>[];
  data: TData[] | ResponseData<TData>;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showNumeration?: boolean;
  showFilters?: boolean;
}

export function DataTable<TData, TValue>({
  data,
  columns,
  className,
  onPageChange,
  sizeQuery = 'size',
  pageQuery = 'page',
  onPageSizeChange,
  isLoading = false,
  headerCenter = false,
  isPaginated = true,
  pageSizeOptions,
  showNumeration = true,
  showFilters = false,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation('common');
  const { addParams } = useCustomSearchParams();
  const isContentData = data && typeof data === 'object' && 'content' in data;
  const tableData = isContentData ? data.content : data;

  const pageCount = isContentData ? data?.page?.totalPages : undefined;

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [searchParams] = useSearchParams();
  const currentPage = +(searchParams.get(pageQuery) || 1);
  const pageSize = +(searchParams.get(sizeQuery) || 10);

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else if (isContentData) {
      addParams({ [pageQuery]: page });
    }
  };

  const handlePageSizeChange = (size: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(size);
    } else if (isContentData) {
      addParams({ [sizeQuery]: size }, 'page', 'p');
    }
  };

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
      <div className={cn('relative rounded-md bg-white overflow-auto', className)}>
        <Table className="p-2">
          <TableHeader className="p-2 font-semibold text-black">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {showNumeration && (
                  <TableHead
                    className={cn(
                      'w-16',
                      showFilters
                        ? 'first:rounded-tl-lg! last:rounded-tr-lg!'
                        : 'first:rounded-l-lg! last:rounded-r-lg!',
                    )}
                  >
                    T/r
                  </TableHead>
                )}
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      showFilters
                        ? 'first:rounded-tl-lg! last:rounded-tr-lg!'
                        : 'first:rounded-l-lg! last:rounded-r-lg!',
                    )}
                    style={{
                      ...getCommonPinningStyles({ column: header.column }),
                      ...(headerCenter ? { textAlign: 'center' } : {}),
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}

            {showFilters && (
              <TableRow className="bg-neutral-50">
                {showNumeration && (
                  <TableHead className="first:rounded-bl-lg last:rounded-br-lg" style={{ width: '15px' }} />
                )}
                {table.getAllColumns().map((column) => {
                  const columnDef = column.columnDef;
                  const key = (columnDef as any).filterKey as string | undefined;
                  if (!key || key === 'actions') return <TableHead key={column.id}></TableHead>;
                  return (
                    <TableHead key={column.id} className="first:rounded-bl-lg last:rounded-br-lg">
                      <ColumnFilterInput columnKey={key} />
                    </TableHead>
                  );
                })}
              </TableRow>
            )}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, idx) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {showNumeration && (
                    <TableCell>{currentPage > 1 ? idx + (currentPage * pageSize - (pageSize - 1)) : idx + 1}</TableCell>
                  )}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                        ...getCommonPinningStyles({ column: cell.column }),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-white">
                <TableCell colSpan={columns?.length + (showNumeration ? 1 : 0)} className="text-center">
                  <div className="flex flex-col items-center gap-4 justify-center h-80 w-full">
                    <Icon name="no-data" size={160} />
                    <p className="font-medium">{t('no_data')}</p>
                  </div>
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
