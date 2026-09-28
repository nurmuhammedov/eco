export interface PageInfo {
  size: number
  number: number
  totalPages: number
  totalElements: number
}

export interface ResponseData<T> {
  content: T[]
  page: PageInfo
}

export interface ApiResponse<T> {
  data: T
  status: number
  success: boolean
  message?: string
  errors?: Record<string, string>
}

/** What a query string can carry: scalars, lists of them, or nothing */
export type SearchParamValue = string | number | boolean | null | undefined | ReadonlyArray<string | number>

export type ISearchParams = Record<string, SearchParamValue>

/** What reading the address bar can yield: numbers and booleans are parsed back, the rest stays text */
export type UrlParamValue = string | number | boolean

export type UrlParams = Record<string, UrlParamValue | undefined>

/** A stored file with the registry details attached to it (backend FileDto) */
export interface FileDto {
  path: string | null
  number: string | null
  expiryDate: string | null
  uploadDate: string | null
}
