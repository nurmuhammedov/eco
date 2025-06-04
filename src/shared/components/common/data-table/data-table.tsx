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
  VisibilityState
} from '@tanstack/react-table';
import * as React from 'react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTablePagination } from './data-table-pagination';
import { getCommonPinningStyles } from './models/get-common-pinning';
import { useSearchParams } from 'react-router-dom';

interface DataTableProps<TData, TValue> {
  className?: string;
  isLoading?: boolean;
  isPaginated?: boolean;
  pageSizeOptions?: number[];
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | ResponseData<TData>;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showNumeration?: boolean;
}

export function DataTable<TData, TValue>({
                                           data,
                                           columns,
                                           className,
                                           onPageChange,
                                           onPageSizeChange,
                                           isLoading = false,
                                           isPaginated = true,
                                           pageSizeOptions,
                                           showNumeration = true
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
  const currentPage = +(searchParams.get('page') || 1);
  const pageSize = +(searchParams.get('size') || 10);

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else if (isContentData) {
      addParams({ page });
    }
  };

  const handlePageSizeChange = (size: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(size);
    } else if (isContentData) {
      addParams({ size }, 'page');
    }
  };

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters
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
    getFacetedUniqueValues: getFacetedUniqueValues()
  });

  return (
    <Fragment>
      <div className={cn('relative rounded-md bg-white overflow-auto', className)}>
        <Table className="p-2">
          <TableHeader className="p-2 font-semibold text-black">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {showNumeration &&
                  <TableHead style={{width:'15px'}}>
                    T/r
                  </TableHead>
                }
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getCommonPinningStyles({ column: header.column })
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, idx) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {
                    showNumeration && <TableCell>
                      {currentPage > 1
                        ? idx + (currentPage * pageSize - (pageSize - 1))
                        : idx + 1}
                    </TableCell>
                  }
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                        ...getCommonPinningStyles({ column: cell.column })
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-white">
                <TableCell colSpan={columns?.length} className="text-center">
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
