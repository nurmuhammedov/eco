import { DeviceType } from '@/shared/types/enums';
import { useCallback, useEffect, useState } from 'react';
import { getDeviceType } from '@/shared/utils/getDeviceType';

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
      deviceType: getDeviceType(window.innerWidth),
    };
  });

  const handleResize = useCallback((): void => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
      deviceType: getDeviceType(window.innerWidth),
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return windowSize;
};
