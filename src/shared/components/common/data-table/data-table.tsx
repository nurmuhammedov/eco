import Icon from '@/shared/components/common/icon'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { useCustomSearchParams } from '@/shared/hooks'
import { cn } from '@/shared/lib/utils'
import { ResponseData } from '@/shared/types/api'
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
} from '@tanstack/react-table'
import * as React from 'react'
import { Fragment } from 'react'
import { DataTablePagination } from './data-table-pagination'
import { getCommonPinningStyles } from './models/get-common-pinning'
import { ColumnFilterInput } from '@/shared/components/common/data-table/column-filter-input'
import { DateDisableStrategy } from '@/shared/components/ui/datepicker'

export type ExtendedColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  filterKey?: string
  filterType?: 'search' | 'select' | 'date' | 'number'
  filterOptions?: { id: string; name: string }[]
  filterDateStrategy?: DateDisableStrategy
  filterMaxLength?: number
}

interface DataTableProps<TData, TValue> {
  className?: string
  isLoading?: boolean
  isPaginated?: boolean
  pageQuery?: 'page' | 'p'
  sizeQuery?: string
  headerCenter?: boolean
  pageSizeOptions?: number[]
  columns: ExtendedColumnDef<TData, TValue>[]
  data: TData[] | ResponseData<TData>
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  showNumeration?: boolean
  showFilters?: boolean
}

export function DataTable<TData, TValue>({
  data,
  columns,
  className,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  headerCenter = false,
  isPaginated = true,
  pageSizeOptions,
  showNumeration = true,
  showFilters = false,
}: DataTableProps<TData, TValue>) {
  const {
    paramsObject: { page = 1, size = 10 },
    addParams,
  } = useCustomSearchParams()
  const isContentData = data && typeof data === 'object' && 'content' in data
  const tableData = isContentData ? data.content : data

  const pageCount = isContentData ? data?.page?.totalPages : undefined

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page)
    } else if (isContentData) {
      addParams({ page })
    }
  }

  const handlePageSizeChange = (size: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(size)
    } else if (isContentData) {
      addParams({ size }, 'page')
    }
  }

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
  })

  return (
    <Fragment>
      <div className={cn('relative overflow-auto rounded-md bg-white', className)}>
        <Table className="p-2">
          <TableHeader className="p-2 font-semibold text-black">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {showNumeration && (
                  <TableHead
                    className={cn(
                      'w-[50px]',
                      showFilters
                        ? 'first:rounded-tl-lg! last:rounded-tr-lg!'
                        : 'first:rounded-l-lg! last:rounded-r-lg!'
                    )}
                    style={{ width: '50px', maxWidth: '50px' }}
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
                        : 'first:rounded-l-lg! last:rounded-r-lg!'
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
              <TableRow className="border-neutral-200 !bg-white even:!bg-white hover:!bg-white">
                {showNumeration && (
                  <TableHead
                    className="!h-8 border-b-2 border-neutral-200 !bg-white !p-0 even:!bg-white hover:!bg-white"
                    style={{
                      width: '50px',
                      minWidth: '50px',
                      maxWidth: '50px',
                    }}
                  />
                )}
                {table.getAllColumns().map((column) => {
                  const columnDef = column.columnDef as ExtendedColumnDef<TData, TValue>
                  const key = columnDef.filterKey

                  if (!key || key === 'actions')
                    return (
                      <TableHead
                        key={column.id}
                        className="!h-8 border-b-2 border-neutral-200 !bg-white !p-0 even:!bg-white hover:!bg-white"
                      ></TableHead>
                    )

                  return (
                    <TableHead
                      key={column.id}
                      className="!h-8 border-b-2 border-neutral-200 !bg-white !p-0 even:!bg-white hover:!bg-white"
                    >
                      <ColumnFilterInput column={columnDef} />
                    </TableHead>
                  )
                })}
              </TableRow>
            )}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, idx) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {showNumeration && (
                    <TableCell style={{ width: '50px', maxWidth: '50px' }}>
                      {Number(page || 1) > 1 ? (Number(page || 1) - 1) * Number(size || 10) + idx + 1 : idx + 1}
                    </TableCell>
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
                  <div className="flex h-80 w-full flex-col items-center justify-center gap-4">
                    <Icon name="no-data" size={160} />
                    <p className="font-medium">Hech qanday maʼlumot topilmadi!</p>
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
  )
}
