import { apiConfig } from '@/shared/api/constants.ts'
import { Button } from '@/shared/components/ui/button'
import { isPDFUrl } from '@/shared/lib'
import { cn } from '@/shared/lib/utils'
import { useEffect, useRef, useState } from 'react'

export enum ZoomLevel {
  // TINY = 50,
  SMALL = 80,
  // NORMAL = 100,
  // LARGE = 125,
  // PAGE_WIDTH = 'page-width',
  // PAGE_FIT = 'page-fit',
}

export enum ViewMode {
  SINGLE_PAGE = 'SinglePage',
  // TWO_PAGE = 'TwoPage',
  // CONTINUOUS = 'Continuous',
  // FIT_H = 'FitH',
  // FIT_V = 'FitV',
}

interface PDFViewerProps {
  title?: string
  width?: string
  height?: string
  className?: string
  viewMode?: ViewMode
  documentUrl: string
  lightMode?: boolean
  onLoad?: () => void
  showToolbar?: boolean
  initialZoom?: ZoomLevel | number
  onError?: (error: Error) => void
  onViewModeChange?: (mode: ViewMode) => void
  onZoomChange?: (zoom: ZoomLevel | number) => void
}

export const PDFViewer = ({
  documentUrl,
  title,
  className,
  width = '100%',
  // height propini olib tashladik yoki ishlatmaymiz, chunki bizga 100% kerak
  viewMode = ViewMode.SINGLE_PAGE,
  showToolbar = false,
  lightMode = true,
  initialZoom = ZoomLevel.SMALL,
  onLoad,
  onError,
}: PDFViewerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('PDF faylni yuklashda xatolik yuz berdi')
  const [key, setKey] = useState<number>(0)

  useEffect(() => {
    if (!documentUrl) {
      setHasError(true)
      setErrorMessage('PDF manzili (URL) ko‘rsatilmagan')
      setIsLoading(false)
      onError?.(new Error('PDF manzili (URL) ko‘rsatilmagan'))
      return
    }

    if (!isPDFUrl(documentUrl)) {
      setHasError(true)
      setErrorMessage('PDF manzili noto‘g‘ri formatda')
      setIsLoading(false)
      onError?.(new Error('PDF manzili noto‘g‘ri formatda'))
      return
    }

    setHasError(false)
    setIsLoading(true)
    setKey((prev) => prev + 1)
  }, [documentUrl, onError])

  const handleIframeLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleIframeError = () => {
    setHasError(true)
    setIsLoading(false)
    onError?.(new Error('PDF faylni yuklashda xatolik yuz berdi'))
  }

  const handleDownload = () => {
    window.open(documentUrl, '_blank')
  }

  const getPdfUrl = () => {
    if (!documentUrl) return ''
    const baseUrl = documentUrl.split('#')[0]
    const toolbarParam = showToolbar ? '1' : '0'
    const bgColor = lightMode ? '#ffffff' : '#1f1f1f'
    const params = [
      `toolbar=${toolbarParam}`,
      'navpanes=0',
      `view=${viewMode}`,
      `zoom=${initialZoom}`,
      `bgcolor=${bgColor}`,
    ].join('&')
    return `${apiConfig.baseURL}${baseUrl}#${params}`
  }

  if (hasError) {
    return (
      <div className="rounded-lg border bg-red-100 p-6 text-red-800 dark:bg-red-200/50">
        <h3 className="mb-2 text-lg font-semibold">Xatolik yuz berdi</h3>
        <p>{errorMessage}</p>
        {documentUrl && isPDFUrl(documentUrl) && (
          <Button
            onClick={handleDownload}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Yuklab olish
          </Button>
        )}
      </div>
    )
  }

  return (
    <div
      // O'ZGARISH: h-full qo'shildi, overflow-y-auto olib tashlandi
      className={cn('relative h-full w-full overflow-hidden rounded-md dark:border-gray-600', className)}
      style={{ width }}
    >
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm dark:bg-gray-900/70">
          <div className="text-center">
            <div className="mb-2 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            <p className="text-sm text-gray-600 dark:text-gray-300">PDF yuklanmoqda...</p>
          </div>
        </div>
      )}

      <iframe
        key={key}
        allowFullScreen
        ref={iframeRef}
        src={getPdfUrl()}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        style={{ height: '100%', width: '100%' }}
        title={title || 'PDF ko‘ruvchi'}
        className={cn(
          'scrollbar-x-hidden block h-full w-full rounded-md transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      />
    </div>
  )
}
