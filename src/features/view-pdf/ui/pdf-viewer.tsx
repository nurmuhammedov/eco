// src/features/view-pdf/ui/pdf-viewer.tsx
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { isPDFUrl } from '@/shared/lib';
import { Button } from '@/shared/components/ui/button';

// Zoom darajasi uchun enum
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

// Ko'rish rejimi uchun enum
export enum ViewMode {
  SINGLE_PAGE = 'SinglePage',
  TWO_PAGE = 'TwoPage',
  CONTINUOUS = 'Continuous',
  FIT_H = 'FitH',
  FIT_V = 'FitV',
}

interface PDFViewerProps {
  url: string;
  title?: string;
  className?: string;
  height?: string;
  width?: string;
  viewMode?: ViewMode;
  showToolbar?: boolean;
  lightMode?: boolean;
  onLoad?: () => void;
  initialZoom?: ZoomLevel | number;
  onError?: (error: Error) => void;
  onViewModeChange?: (mode: ViewMode) => void;
  onZoomChange?: (zoom: ZoomLevel | number) => void;
}

export const PDFViewer = ({
  url,
  title,
  className,
  height = '900px',
  width = '100%',
  initialZoom = ZoomLevel.NORMAL,
  viewMode = ViewMode.FIT_V,
  showToolbar = false,
  lightMode = true,
  onLoad,
  onError,
  onZoomChange,
  onViewModeChange,
}: PDFViewerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('PDF faylni yuklashda xatolik yuz berdi');
  const [currentZoom, setCurrentZoom] = useState<ZoomLevel | number>(initialZoom);
  const [currentViewMode, setCurrentViewMode] = useState<ViewMode>(viewMode);
  const [key, setKey] = useState<number>(0); // iframe ni yangilash uchun key

  // PDF URL validatsiyasi
  useEffect(() => {
    if (!url) {
      setHasError(true);
      setErrorMessage("PDF URL ko'rsatilmagan");
      setIsLoading(false);
      if (onError) onError(new Error("PDF URL ko'rsatilmagan"));
      return;
    }

    if (!isPDFUrl(url)) {
      setHasError(true);
      setErrorMessage("PDF URL noto'g'ri formatda");
      setIsLoading(false);
      if (onError) onError(new Error("PDF URL noto'g'ri formatda"));
      return;
    }

    setHasError(false);
    setIsLoading(true);
    // URL o'zgarganda iframe ni yangilash
    setKey((prev) => prev + 1);
  }, [url, onError]);

  // PDF yuklanganda loading holatini o'zgartirish
  const handleIframeLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  // PDF yuklashda xatolik bo'lganda
  const handleIframeError = () => {
    setHasError(true);
    setIsLoading(false);
    if (onError) onError(new Error('PDF faylni yuklashda xatolik yuz berdi'));
  };

  // PDF yuklab olish
  const handleDownload = () => {
    window.open(url, '_blank');
  };

  // PDF ni to'liq ekranda ko'rsatish
  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  // PDF ni chop etish
  const handlePrint = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.print();
    }
  };

  // Zoom darajasini o'zgartirish
  const handleZoomChange = (zoom: ZoomLevel | number) => {
    setCurrentZoom(zoom);
    if (onZoomChange) onZoomChange(zoom);
    // iframe ni yangilash
    setKey((prev) => prev + 1);
  };

  // Ko'rinish rejimini o'zgartirish
  const handleViewModeChange = (mode: ViewMode) => {
    setCurrentViewMode(mode);
    if (onViewModeChange) onViewModeChange(mode);
    // iframe ni yangilash
    setKey((prev) => prev + 1);
  };

  // PDF URL ni parametrlar bilan yaratish
  const getPdfUrl = () => {
    if (!url) return '';

    // Asosiy URL
    const baseUrl = url.split('#')[0];

    // Toolbar, navigatsiya paneli parametrlari
    const toolbarParam = showToolbar ? '1' : '0';

    // Fon rangi (light mode)
    const bgColor = lightMode ? '%23FFFFFF' : '%23333333';

    // URL parametrlari
    const params = [
      `toolbar=${toolbarParam}`,
      'navpanes=0',
      `view=${currentViewMode}`,
      `zoom=${currentZoom}`,
      `bgcolor=${bgColor}`,
    ].join('&');

    return `${baseUrl}#${params}`;
  };

  if (hasError) {
    return (
      <div className="border rounded-lg p-6 bg-red-50 text-red-700">
        <h3 className="text-lg font-semibold mb-2">Xatolik yuz berdi</h3>
        <p>{errorMessage}</p>
        {url && isPDFUrl(url) && (
          <Button
            onClick={handleDownload}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Yuklab olishga urinish
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn('w-full overflow-hidden rounded-md shadow-sm', className)} style={{ width }}>
      {/* Header with title and actions */}
      <div className="">
        {/* Toolbar */}
        {showToolbar && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Zoom controls */}
            <div className="flex items-center gap-1 mr-2">
              <Button
                onClick={() => handleZoomChange(ZoomLevel.SMALL)}
                className="flex items-center rounded-md bg-gray-100 w-8 h-8 p-0 justify-center text-gray-700 hover:bg-gray-200"
                disabled={isLoading}
                aria-label="Kichiklashtirish"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </Button>

              <select
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
                value={String(currentZoom)}
                onChange={(e) => handleZoomChange(e.target.value as ZoomLevel)}
                disabled={isLoading}
              >
                <option value={ZoomLevel.TINY}>50%</option>
                <option value={ZoomLevel.SMALL}>75%</option>
                <option value={ZoomLevel.NORMAL}>100%</option>
                <option value={ZoomLevel.LARGE}>125%</option>
                <option value={ZoomLevel.XLARGE}>150%</option>
                <option value={ZoomLevel.XXLARGE}>200%</option>
                <option value={ZoomLevel.PAGE_WIDTH}>Sahifa kengligi</option>
                <option value={ZoomLevel.PAGE_FIT}>To'liq sahifa</option>
              </select>

              <Button
                onClick={() => handleZoomChange(ZoomLevel.LARGE)}
                className="flex items-center rounded-md bg-gray-100 w-8 h-8 p-0 justify-center text-gray-700 hover:bg-gray-200"
                disabled={isLoading}
                aria-label="Kattalashtirish"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Button>
            </div>

            {/* View mode */}
            <select
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm mr-2"
              value={currentViewMode}
              onChange={(e) => handleViewModeChange(e.target.value as ViewMode)}
              disabled={isLoading}
            >
              <option value={ViewMode.FIT_H}>Gorizontal</option>
              <option value={ViewMode.FIT_V}>Vertikal</option>
              <option value={ViewMode.SINGLE_PAGE}>Bitta sahifa</option>
              <option value={ViewMode.TWO_PAGE}>Ikki sahifa</option>
              <option value={ViewMode.CONTINUOUS}>Uzluksiz</option>
            </select>

            {/* Actions */}
            <Button
              onClick={handleFullscreen}
              className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              disabled={isLoading}
              aria-label="To'liq ekran"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                />
              </svg>
              <span className="hidden sm:inline">To'liq ekran</span>
            </Button>

            <Button
              onClick={handlePrint}
              className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              disabled={isLoading}
              aria-label="Chop etish"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              <span className="hidden sm:inline">Chop etish</span>
            </Button>

            <Button
              onClick={handleDownload}
              className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              aria-label="Yuklab olish"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span className="hidden sm:inline">Yuklab olish</span>
            </Button>
          </div>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-2"></div>
            <p className="text-gray-500">PDF yuklanmoqda...</p>
          </div>
        </div>
      )}

      {/* PDF iframe - content bilan bir xil border */}
      <div className="bg-white" style={{ height }}>
        <iframe
          key={key}
          allowFullScreen
          ref={iframeRef}
          src={getPdfUrl()}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          style={{ display: 'block' }}
          title={title || 'PDF Viewer'}
          className={cn('w-full h-full border-0 bg-white rounded-b-md', isLoading ? 'opacity-0' : 'opacity-100')}
        />
      </div>
    </div>
  );
};
