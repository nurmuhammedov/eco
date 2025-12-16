export enum ZoomLevel {
  TINY = 50,
  SMALL = 75,
  NORMAL = 100,
  LARGE = 125,
  PAGE_WIDTH = 'page-width',
  PAGE_FIT = 'page-fit',
}

export enum ViewMode {
  SINGLE_PAGE = 'SinglePage',
  TWO_PAGE = 'TwoPage',
  CONTINUOUS = 'Continuous',
  FIT_H = 'FitH',
  FIT_V = 'FitV',
  FIT_PAGE = 'Fit',
}

export interface PDFViewerProps {
  url: string
  title?: string
  className?: string
  height?: string
  width?: string
  initialZoom?: ZoomLevel | number
  viewMode?: ViewMode
  showToolbar?: boolean
  lightMode?: boolean
  onLoad?: () => void
  onError?: (error: Error) => void
  onZoomChange?: (zoom: ZoomLevel | number) => void
  onViewModeChange?: (mode: ViewMode) => void
}
