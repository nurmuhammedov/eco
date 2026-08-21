import { useEffect, useRef } from 'react'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { useTranslation } from 'react-i18next'
import { ResponseData } from '@/shared/types/api'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import ReactPaginate from 'react-paginate'

interface PaginationProps<T = any> {
  data?: ResponseData<T>
  className?: string
  showTotal?: boolean
  isLoading?: boolean
  showSizeChanger?: boolean
  showQuickJumper?: boolean // Note: Quick jumper (first/last) is handled differently with react-paginate or custom buttons outside
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  pageCount?: number
  currentPage?: number
  pageSize?: number
  /** Used when the table is fed a plain array instead of a paged response. */
  totalElements?: number
}

export function DataTablePagination<T>({
  data,
  className,
  onPageChange,
  onPageSizeChange,
  showTotal = true,
  isLoading = false,
  showSizeChanger = true,
  showQuickJumper = true,
  pageSizeOptions = [10, 20, 50, 100],
  pageCount: manualPageCount,
  currentPage: manualCurrentPage,
  pageSize: manualPageSize,
  totalElements: manualTotalElements,
}: PaginationProps<T>) {
  const { t } = useTranslation('common')

  const {
    totalPages: apiTotalPages,
    totalElements: apiTotalElements,
    size: apiSize,
    number: apiPage,
  } = data?.page ?? {}

  const totalElements = apiTotalElements ?? manualTotalElements ?? 0
  const isEmpty = totalElements === 0
  // A cold load has no count yet; showing "0" would be wrong rather than merely empty.
  const isCountUnknown = isLoading && apiTotalElements === undefined && manualTotalElements === undefined

  // Kept visible on an empty result so the page size and page 1 stay reachable.
  const totalPages = Math.max(apiTotalPages ?? manualPageCount ?? 0, 1)
  const pageSize = apiSize ?? manualPageSize ?? 10
  const resolvedPage = apiPage !== undefined ? apiPage + 1 : (manualCurrentPage ?? 1)
  const currentPage = isEmpty ? 1 : Math.min(Math.max(resolvedPage, 1), totalPages)

  const pageInfo = { currentPage, totalPages, pageSize, totalElements }

  const onPageChangeRef = useRef(onPageChange)

  useEffect(() => {
    onPageChangeRef.current = onPageChange
  })

  // A filter can empty a list the user was paging through; send them back to the start.
  useEffect(() => {
    if (!isLoading && !isCountUnknown && isEmpty && resolvedPage > 1) onPageChangeRef.current(1)
  }, [isLoading, isCountUnknown, isEmpty, resolvedPage])

  const handlePageClick = (event: { selected: number }) => {
    onPageChange(event.selected + 1)
  }

  const handlePageChange = (page: number) => {
    onPageChange(page)
  }

  return (
    <div className={cn('mt-2 flex flex-col-reverse items-center justify-between gap-2 lg:flex-row', className)}>
      <div className="flex w-full items-center justify-between gap-4 lg:w-auto lg:justify-start">
        {showSizeChanger && (
          <Select
            disabled={isLoading}
            value={String(pageInfo.pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-9 w-[90px] min-w-[90px]">
              <SelectValue placeholder={pageInfo.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {showTotal && !isCountUnknown && (
          <span className="text-muted-foreground text-sm whitespace-nowrap">
            {t('total_elements', { count: pageInfo.totalElements })}
          </span>
        )}
      </div>

      <div className="scrollbar-hidden flex max-w-full items-center gap-1 overflow-x-auto select-none">
        {/* First page */}
        {showQuickJumper && (
          <Button
            onClick={() => handlePageChange(1)}
            disabled={pageInfo.currentPage <= 1 || isLoading}
            className={cn(
              'border-input text-foreground hover:bg-accent hover:text-accent-foreground flex h-9 w-auto min-w-9 items-center justify-center rounded-md border bg-white px-2 shadow-none transition-all',
              pageInfo.currentPage <= 1 && 'pointer-events-none opacity-50'
            )}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        )}

        <ReactPaginate
          breakLabel="..."
          nextLabel={<ChevronRight className="h-4 w-4" />}
          previousLabel={<ChevronLeft className="h-4 w-4" />}
          onPageChange={handlePageClick}
          pageRangeDisplayed={3} // 3 items in middle
          marginPagesDisplayed={3} // 3 items on sides
          pageCount={pageInfo.totalPages}
          forcePage={pageInfo.currentPage - 1}
          renderOnZeroPageCount={null}
          containerClassName="flex items-center gap-1"
          // Page Numbers
          pageClassName="rounded-md"
          pageLinkClassName="flex h-9 min-w-9 w-auto px-3 items-center justify-center rounded-md border border-input bg-white text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-all"
          // Active Page
          activeClassName="!bg-[#016b7b] !border-[#016b7b] !text-white hover:!bg-[#016b7b]/90"
          activeLinkClassName="!bg-[#016b7b] !border-[#016b7b] !text-white hover:!bg-[#016b7b]/90"
          // Navigation (Prev/Next)
          previousClassName="rounded-md"
          nextClassName="rounded-md"
          previousLinkClassName={cn(
            'flex h-9 min-w-9 w-auto px-2 items-center justify-center rounded-md border border-input bg-white text-foreground transition-all hover:bg-accent hover:text-accent-foreground',
            pageInfo.currentPage <= 1 && 'pointer-events-none'
          )}
          nextLinkClassName={cn(
            'flex h-9 min-w-9 w-auto px-2 items-center justify-center rounded-md border border-input bg-white text-foreground transition-all hover:bg-accent hover:text-accent-foreground',
            pageInfo.currentPage >= pageInfo.totalPages && 'pointer-events-none'
          )}
          // Break (...)
          breakClassName="flex items-center justify-center"
          breakLinkClassName="flex h-9 min-w-9 w-auto items-center justify-center px-1 text-sm text-muted-foreground"
          disabledClassName="opacity-50 pointer-events-none"
        />

        {/* Last page */}
        {showQuickJumper && (
          <Button
            onClick={() => handlePageChange(pageInfo.totalPages)}
            disabled={pageInfo.currentPage >= pageInfo.totalPages || isLoading}
            className={cn(
              'border-input text-foreground hover:bg-accent hover:text-accent-foreground flex h-9 w-auto min-w-9 items-center justify-center rounded-md border bg-white px-2 shadow-none transition-all',
              pageInfo.currentPage >= pageInfo.totalPages && 'pointer-events-none opacity-50'
            )}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
