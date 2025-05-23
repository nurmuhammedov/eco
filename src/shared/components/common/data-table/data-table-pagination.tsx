import { useMemo } from 'react';
import { cn } from '@/shared/lib/utils';
import { useTranslation } from 'react-i18next';
import { ResponseData } from '@/shared/types/api';
import { Button } from '@/shared/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

interface PaginationProps<T = any> {
  data?: ResponseData<T>;
  className?: string;
  showTotal?: boolean;
  isLoading?: boolean;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
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
}: PaginationProps<T>) {
  const { t } = useTranslation('common');

  // Move all hook calls above any conditional returns
  const shouldRender = !!(data && data.page && data.page.totalElements > 0);

  const pageInfo = useMemo(() => {
    if (!shouldRender)
      return {
        currentPage: 1,
        totalPages: 0,
        pageSize: 0,
        totalElements: 0,
        startItem: 0,
        endItem: 0,
      };

    const { totalPages, totalElements, size: pageSize, number: page } = data?.page ?? {};
    const currentPage = page + 1;
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(startItem + pageSize - 1, totalElements);

    return { currentPage, totalPages, pageSize, totalElements, startItem, endItem };
  }, [data, shouldRender]);

  const getPageItems = useMemo(() => {
    // Skip if only one page
    if (!shouldRender || pageInfo.totalPages <= 1) {
      return { items: pageInfo.totalPages ? [1] : [], jumpPrev: false, jumpNext: false };
    }

    // Always show first, last and up to 5 pages around current
    const items: number[] = [];
    let jumpPrev = false;
    let jumpNext = false;

    // Define constants
    const allPages = Array.from({ length: pageInfo.totalPages }, (_, i) => i + 1);
    const MIN_VISIBLE = 7; // min buttons: 1 ... 4 5 6 ... 100

    // Logic for pages <= MIN_VISIBLE
    if (pageInfo.totalPages <= MIN_VISIBLE) {
      return { items: allPages, jumpPrev: false, jumpNext: false };
    }

    // Logic for many pages (Ant Design algorithm)
    // Always include first page
    items.push(1);

    // Show ellipsis before current
    if (pageInfo.currentPage > 4) {
      jumpPrev = true;
    } else {
      // Show 2,3,4 if near start
      for (let i = 2; i < pageInfo.currentPage; i++) {
        items.push(i);
      }
    }

    // Pages around current
    const leftBound = Math.max(2, pageInfo.currentPage - 1);
    const rightBound = Math.min(pageInfo.totalPages - 1, pageInfo.currentPage + 1);

    for (let i = leftBound; i <= rightBound; i++) {
      items.push(i);
    }

    // Show ellipsis after current
    if (pageInfo.currentPage < pageInfo.totalPages - 3) {
      jumpNext = true;
    } else {
      // Show pages if near end
      for (let i = pageInfo.currentPage + 2; i < pageInfo.totalPages; i++) {
        items.push(i);
      }
    }

    // Always include last page
    if (pageInfo.totalPages > 1) {
      items.push(pageInfo.totalPages);
    }

    return { items, jumpPrev, jumpNext };
  }, [pageInfo, shouldRender]);

  const hasPageItems = useMemo(() => getPageItems.items.length > 1, [getPageItems]);

  // Return null after all hooks are called
  if (!shouldRender) {
    return null;
  }

  // Handle page change - always use 1-indexed pages here
  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  // Jump to page groups
  const jumpPrevious = () => {
    const newPage = Math.max(1, pageInfo.currentPage - 3);
    handlePageChange(newPage);
  };

  const jumpNext = () => {
    const newPage = Math.min(pageInfo.totalPages, pageInfo.currentPage + 3);
    handlePageChange(newPage);
  };

  return (
    <div className={cn('flex flex-col md:flex-row items-center justify-between gap-4 pt-3', className)}>
      {showTotal && pageInfo.totalElements > 0 && (
        <div className="flex flex-row items-center gap-2">
          {showSizeChanger && (
            <Select
              disabled={isLoading}
              value={String(pageInfo.pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-20">
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
          <div className="text-sm text-muted-foreground">
            {t('showing_items', {
              start: pageInfo.startItem,
              end: pageInfo.endItem,
              total: pageInfo.totalElements,
            })}
          </div>
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* First page */}
        {showQuickJumper && (
          <Button
            size="icon"
            variant="outline"
            className="size-9 flex"
            onClick={() => handlePageChange(1)}
            disabled={pageInfo.currentPage === 1 || isLoading || !hasPageItems}
          >
            <span className="sr-only">{t('first_page')}</span>
            <ChevronsLeft className="size-4" />
          </Button>
        )}

        {/* Previous page */}
        <Button
          className="h-9"
          variant="outline"
          disabled={pageInfo.currentPage === 1 || isLoading || !hasPageItems}
          onClick={() => handlePageChange(pageInfo.currentPage - 1)}
        >
          <ChevronLeft className="size-4" />
          <span className="">{t('previous')}</span>
        </Button>

        {/* Page numbers with ellipsis */}
        <div className="flex items-center gap-2.5">
          {/* Render actual page numbers */}
          {getPageItems.items.map((pageNumber, index) => {
            // Show ellipsis after first page if needed
            if (index === 1 && getPageItems.jumpPrev) {
              return (
                <Button
                  size="sm"
                  variant="outline"
                  key="prev-ellipsis"
                  disabled={isLoading}
                  onClick={jumpPrevious}
                  className="size-9 inline-flex"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              );
            }

            // Show ellipsis before last page if needed
            if (index === getPageItems.items.length - 2 && getPageItems.jumpNext) {
              return (
                <Button
                  size="sm"
                  variant="outline"
                  key="next-ellipsis"
                  onClick={jumpNext}
                  disabled={isLoading}
                  className="size-9 inline-flex"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              );
            }

            // Skip rendering duplicate items
            if (
              index > 0 &&
              index < getPageItems.items.length - 1 &&
              getPageItems.items.indexOf(pageNumber) !== getPageItems.items.lastIndexOf(pageNumber)
            ) {
              return null;
            }

            return (
              <Button
                key={`page-${pageNumber}`}
                variant={pageNumber === pageInfo.currentPage ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'size-9',
                  pageNumber === pageInfo.currentPage ? 'bg-blue-400 hover:bg-blue-400/90 text-white' : '',
                  'inline-flex',
                )}
                onClick={() => handlePageChange(pageNumber)}
                disabled={isLoading}
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>

        <Button
          className="h-9"
          variant="outline"
          onClick={() => handlePageChange(pageInfo.currentPage + 1)}
          disabled={pageInfo.currentPage >= pageInfo.totalPages || isLoading || !hasPageItems}
        >
          <span>{t('next')}</span>
          <ChevronRight className="size-4" />
        </Button>

        {/* Last page */}
        {showQuickJumper && (
          <Button
            variant="outline"
            size="icon"
            className="size-9 flex"
            onClick={() => handlePageChange(pageInfo.totalPages)}
            disabled={pageInfo.currentPage >= pageInfo.totalPages || isLoading || !hasPageItems}
          >
            <span className="sr-only">{t('last_page')}</span>
            <ChevronsRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
