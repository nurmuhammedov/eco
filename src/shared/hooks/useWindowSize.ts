import { DeviceType } from '@/shared/types/enums';
import { useCallback, useEffect, useState } from 'react';
import { detectDeviceType } from '@/shared/utils/detectDeviceType';

interface WindowSize {
  width: number;
  height: number;
  deviceType: DeviceType;
}

export const useWindowSize = (): Readonly<WindowSize> => {
  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    if (typeof window === 'undefined') {
      return { width: 0, height: 0, deviceType: DeviceType.DESKTOP };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      deviceType: detectDeviceType(window.innerWidth),
    };
  });

  const handleResize = useCallback((): void => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
      deviceType: detectDeviceType(window.innerWidth),
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return windowSize;
};
