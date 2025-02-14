export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface Pageable {
  sort: Sort;
  pageSize: number;
  pageNumber: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface ApiResponse<T> {
  content: T[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  size: number;
  number: number;
  empty: boolean;
}
