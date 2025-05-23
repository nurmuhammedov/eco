// src/features/view-pdf/ui/pdf-viewer.tsx
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { isPDFUrl } from '@/shared/lib';
import { Button } from '@/shared/components/ui/button';
import { apiConfig } from '@/shared/api/constants.ts';

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
  title?: string;
  width?: string;
  height?: string;
  className?: string;
  viewMode?: ViewMode;
  documentUrl: string;
  lightMode?: boolean;
  onLoad?: () => void;
  showToolbar?: boolean;
  initialZoom?: ZoomLevel | number;
  onError?: (error: Error) => void;
  onViewModeChange?: (mode: ViewMode) => void;
  onZoomChange?: (zoom: ZoomLevel | number) => void;
}

export const PDFViewer = ({
  documentUrl,
  title,
  className,
  width = '100%',
  viewMode = ViewMode.SINGLE_PAGE,
  showToolbar = false,
  lightMode = true,
  onLoad,
  onError,
}: PDFViewerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('PDF faylni yuklashda xatolik yuz berdi');
  const [key, setKey] = useState<number>(0); // iframe ni yangilash uchun key

  useEffect(() => {
    if (!documentUrl) {
      setHasError(true);
      setErrorMessage("PDF URL ko'rsatilmagan");
      setIsLoading(false);
      if (onError) onError(new Error("PDF URL ko'rsatilmagan"));
      return;
    }

    if (!isPDFUrl(documentUrl)) {
      setHasError(true);
      setErrorMessage("PDF URL noto'g'ri formatda");
      setIsLoading(false);
      if (onError) onError(new Error("PDF URL noto'g'ri formatda"));
      return;
    }

    setHasError(false);
    setIsLoading(true);

    setKey((prev) => prev + 1);
  }, [documentUrl, onError]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  const handleIframeError = () => {
    setHasError(true);
    setIsLoading(false);
    if (onError) onError(new Error('PDF faylni yuklashda xatolik yuz berdi'));
  };

  const handleDownload = () => {
    window.open(documentUrl, '_blank');
  };

  const getPdfUrl = () => {
    if (!documentUrl) return '';

    // Asosiy URL
    const baseUrl = documentUrl.split('#')[0];

    const toolbarParam = showToolbar ? '1' : '0';

    const bgColor = lightMode ? '#ffffff' : '#ffffff';

    const params = [`toolbar=${toolbarParam}`, 'navpanes=0', `view=${viewMode}`, `bgcolor=${bgColor}`].join('&');

    return `${apiConfig.baseURL}${baseUrl}#${params}`;
  };

  if (hasError) {
    return (
      <div className="border rounded-lg p-6 bg-red-50 text-red-700">
        <h3 className="text-lg font-semibold mb-2">Xatolik yuz berdi</h3>
        <p>{errorMessage}</p>
        {documentUrl && isPDFUrl(documentUrl) && (
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
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-2"></div>
            <p className="text-gray-500">PDF yuklanmoqda...</p>
          </div>
        </div>
      )}

      <div className="bg-white h-[600px] 3xl:h-[900px]">
        <iframe
          key={key}
          width="100%"
          allowFullScreen
          ref={iframeRef}
          src={getPdfUrl()}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          title={title || 'PDF Viewer'}
          className={cn('w-full h-full rounded-b-md', isLoading ? 'opacity-0' : 'opacity-100')}
        />
      </div>
    </div>
  );
};
