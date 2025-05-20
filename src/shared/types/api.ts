export interface PageInfo {
  size: number;
  number: number;
  totalPages: number;
  totalElements: number;
}

export interface ResponseData<T> {
  content: T[];
  page: PageInfo;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
}

export type ISearchParams = Record<string, any>;
