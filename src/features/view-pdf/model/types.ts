export enum ZoomLevel {
  TINY = 50,
  SMALL = 75,
  NORMAL = 100,
  LARGE = 125,
  XLARGE = 150,
  XXLARGE = 200,
  PAGE_WIDTH = 'page-width',
  PAGE_FIT = 'page-fit',
}

/**
 * PDF ko'rsatish rejimlari
 */
export enum ViewMode {
  SINGLE_PAGE = 'SinglePage',
  TWO_PAGE = 'TwoPage',
  CONTINUOUS = 'Continuous',
  FIT_H = 'FitH',
  FIT_V = 'FitV',
  FIT_PAGE = 'Fit',
}

export interface PDFViewerProps {
  /** PDF fayl URL manzili */
  url: string
  /** Hujjat sarlavhasi (ixtiyoriy) */
  title?: string
  /** Qo'shimcha CSS klass */
  className?: string
  /** PDF viewer balandligi */
  height?: string
  /** PDF viewer kengligi */
  width?: string
  /** Boshlang'ich zoom darajasi */
  initialZoom?: ZoomLevel | number
  /** Ko'rsatish rejimi */
  viewMode?: ViewMode
  /** Toolbar ko'rsatilsinmi */
  showToolbar?: boolean
  /** Light mode yoqilsinmi */
  lightMode?: boolean
  /** PDF yuklanganda callback */
  onLoad?: () => void
  /** Xatolik yuz berganda callback */
  onError?: (error: Error) => void
  /** Zoom o'zgarganda callback */
  onZoomChange?: (zoom: ZoomLevel | number) => void
  /** Ko'rinish rejimi o'zgarganda callback */
  onViewModeChange?: (mode: ViewMode) => void
}
