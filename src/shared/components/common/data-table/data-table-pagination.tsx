import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/utils';

// Spring Boot API response interface type
export interface SpringPageResponse<T = any> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

interface PaginationProps<T = any> {
  data?: SpringPageResponse<T>;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  isLoading?: boolean;
  className?: string;
  showPageSizeSelector?: boolean;
  showItemCount?: boolean;
  showFirstLastButtons?: boolean;
  // Bu qismni o'zgartirdik - endi bu sahifalar soni emas, balki
  // ko'rsatiladigan sahifa raqamlari maksimal soni
  maxPageButtons?: number;
}

/**
 * Spring Boot API responselariga moslashtirilgan pagination komponenti
 */
export function DataTablePagination<T>({
  data,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  isLoading = false,
  className,
  showPageSizeSelector = true,
  showItemCount = true,
  showFirstLastButtons = true,
  maxPageButtons = 5,
}: PaginationProps<T>) {
  const { t } = useTranslation('common');

  // Ma'lumotlar bo'sh yoki mavjud bo'lmasa, paginatsiya ko'rsatilmaydi
  if (!data || data.empty || data.totalElements === 0) {
    return null;
  }

  const {
    totalPages,
    number: currentPage,
    size: pageSize,
    totalElements,
  } = data;

  // Elementlar oralig'ini hisoblash
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  // totalElements va pageSize asosida ko'rinadigan sahifa raqamlarini generatsiya qilish
  const getPageButtons = () => {
    if (totalPages <= 1) return [];

    // Agar maxPageButtons 0 yoki totalPages dan katta bo'lsa, barcha sahifalarni ko'rsatish
    if (maxPageButtons <= 0 || maxPageButtons >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    // Sahifalar diapazoni boshlanishi va oxirini hisoblash
    const halfButtons = Math.floor(maxPageButtons / 2);
    let startPage = Math.max(0, currentPage - halfButtons);
    const endPage = Math.min(totalPages - 1, startPage + maxPageButtons - 1);

    // Agar oxiriga yaqin bo'lsa, boshlanishni sozlash
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(0, endPage - maxPageButtons + 1);
    }

    // Sahifa raqamlarini massiv sifatida qaytarish
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  };

  const pageButtons = getPageButtons();

  return (
    <div
      className={cn(
        'flex flex-col md:flex-row items-center justify-between gap-4 py-4',
        className,
      )}
    >
      {/* Elementlar soni ma'lumoti */}
      {showItemCount && totalElements > 0 && (
        <div className="text-sm text-muted-foreground order-2 md:order-1">
          {t('showing_items', {
            start: startItem,
            end: endItem,
            total: totalElements,
          })}
        </div>
      )}

      {/* Paginatsiya boshqaruvi */}
      <div className="flex items-center gap-1 md:gap-2 order-1 md:order-2">
        {/* Birinchi sahifa tugmasi */}
        {showFirstLastButtons && (
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 hidden md:flex"
            onClick={() => onPageChange(0)}
            disabled={currentPage === 0 || isLoading}
          >
            <span className="sr-only">{t('first_page')}</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Oldingi sahifa tugmasi */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0 || isLoading}
        >
          <span className="sr-only">{t('previous_page')}</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Sahifa raqamlari */}
        {pageButtons.length > 0 && (
          <div className="flex items-center gap-1">
            {pageButtons.map((pageNumber) => (
              <Button
                key={pageNumber}
                variant={pageNumber === currentPage ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'h-8 w-8 sm:h-9 sm:w-9',
                  pageNumber === currentPage
                    ? 'bg-primary text-primary-foreground'
                    : '',
                  'hidden sm:inline-flex',
                )}
                onClick={() => onPageChange(pageNumber)}
                disabled={isLoading}
              >
                {pageNumber + 1}
              </Button>
            ))}

            {/* Mobil qurilmalar uchun joriy sahifa / jami sahifalar indikatori */}
            <div className="sm:hidden px-2 text-sm font-medium">
              {currentPage + 1} / {totalPages}
            </div>
          </div>
        )}

        {/* Keyingi sahifa tugmasi */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1 || isLoading}
        >
          <span className="sr-only">{t('next_page')}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Oxirgi sahifa tugmasi */}
        {showFirstLastButtons && (
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 hidden md:flex"
            onClick={() => onPageChange(totalPages - 1)}
            disabled={currentPage >= totalPages - 1 || isLoading}
          >
            <span className="sr-only">{t('last_page')}</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Sahifa o'lchami selektori */}
      {showPageSizeSelector && (
        <div className="flex items-center gap-2 order-3">
          <span className="text-sm font-medium whitespace-nowrap">
            {t('rows_per_page')}:
          </span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
            disabled={isLoading}
          >
            <SelectTrigger className="h-8 w-[70px]">
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
        </div>
      )}
    </div>
  );
}
