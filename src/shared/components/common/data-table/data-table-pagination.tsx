import { useMemo } from 'react';
import { cn } from '@/shared/lib/utils';
import { useTranslation } from 'react-i18next';
import { ResponseData } from '@/shared/types/api';
import { Button } from '@/shared/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

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

  if (!data || !data.page || data.page.totalElements === 0) {
    return null;
  }

  const { totalPages, totalElements, size: pageSize, number: page } = data.page;

  const currentPage = page + 1;

  // Calculate item range based on current page (1-indexed)
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, totalElements);

  const getPageItems = useMemo(() => {
    // Skip if only one page
    if (totalPages <= 1)
      return { items: [1], jumpPrev: false, jumpNext: false };

    // Always show first, last and up to 5 pages around current
    const items: number[] = [];
    let jumpPrev = false;
    let jumpNext = false;

    // Define constants
    const allPages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const MIN_VISIBLE = 7; // min buttons: 1 ... 4 5 6 ... 100

    // Logic for pages <= MIN_VISIBLE
    if (totalPages <= MIN_VISIBLE) {
      return { items: allPages, jumpPrev: false, jumpNext: false };
    }

    // Logic for many pages (Ant Design algorithm)
    // Always include first page
    items.push(1);

    // Show ellipsis before current
    if (currentPage > 4) {
      jumpPrev = true;
    } else {
      // Show 2,3,4 if near start
      for (let i = 2; i < currentPage; i++) {
        items.push(i);
      }
    }

    // Pages around current
    const leftBound = Math.max(2, currentPage - 1);
    const rightBound = Math.min(totalPages - 1, currentPage + 1);

    for (let i = leftBound; i <= rightBound; i++) {
      items.push(i);
    }

    // Show ellipsis after current
    if (currentPage < totalPages - 3) {
      jumpNext = true;
    } else {
      // Show pages if near end
      for (let i = currentPage + 2; i < totalPages; i++) {
        items.push(i);
      }
    }

    // Always include last page
    if (totalPages > 1) {
      items.push(totalPages);
    }

    return { items, jumpPrev, jumpNext };
  }, [currentPage, totalPages]);

  // Handle page change - always use 1-indexed pages here
  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  // Jump to page groups
  const jumpPrevious = () => {
    const newPage = Math.max(1, currentPage - 5);
    handlePageChange(newPage);
  };

  const jumpNext = () => {
    const newPage = Math.min(totalPages, currentPage + 5);
    handlePageChange(newPage);
  };

  const hasPageItems = useMemo(
    () => getPageItems.items.length > 1,
    [getPageItems],
  );

  return (
    <div
      className={cn(
        'flex flex-col md:flex-row items-center justify-between gap-4 pt-3',
        className,
      )}
    >
      {showTotal && totalElements > 0 && (
        <div className="flex flex-row items-center gap-2">
          {showSizeChanger && (
            <Select
              disabled={isLoading}
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-20">
                <SelectValue placeholder={pageSize} />
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
              start: startItem,
              end: endItem,
              total: totalElements,
            })}
          </div>
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* First page */}
        {showQuickJumper && (
          <Button
            variant="outline"
            size="icon"
            className="size-9 flex"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1 || isLoading || !hasPageItems}
          >
            <span className="sr-only">{t('first_page')}</span>
            <ChevronsLeft className="size-4" />
          </Button>
        )}

        {/* Previous page */}
        <Button
          className="h-9"
          variant="outline"
          disabled={currentPage === 1 || isLoading || !hasPageItems}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <ChevronLeft className="size-4" />
          <span className="">{t('previous_page')}</span>
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
            if (
              index === getPageItems.items.length - 2 &&
              getPageItems.jumpNext
            ) {
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
              getPageItems.items.indexOf(pageNumber) !==
                getPageItems.items.lastIndexOf(pageNumber)
            ) {
              return null;
            }

            return (
              <Button
                key={`page-${pageNumber}`}
                variant={pageNumber === currentPage ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'size-9',
                  pageNumber === currentPage
                    ? 'bg-blue-400 hover:bg-blue-400/90 text-white'
                    : '',
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
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading || !hasPageItems}
        >
          <span>{t('next_page')}</span>
          <ChevronRight className="size-4" />
        </Button>

        {/* Last page */}
        {showQuickJumper && (
          <Button
            variant="outline"
            size="icon"
            className="size-9 flex"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage >= totalPages || isLoading || !hasPageItems}
          >
            <span className="sr-only">{t('last_page')}</span>
            <ChevronsRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
