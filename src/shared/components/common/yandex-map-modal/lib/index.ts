import { DeviceType } from '@/shared/types/enums';
import { useWindowSize } from '@/shared/hooks/useWindowSize';

export function getMapContentSize(): string {
  const { deviceType } = useWindowSize();

  const sizeMap: Record<DeviceType, string> = {
    [DeviceType.MOBILE]: '200px',
    [DeviceType.TABLET]: '300px',
    [DeviceType.LAPTOP]: '400px',
    [DeviceType.DESKTOP]: '500px',
    [DeviceType.LARGE_SCREEN]: '500px',
    [DeviceType.QHD_2K]: '1000px',
    [DeviceType.UHD_4K]: '1200px',
  };

  return sizeMap[deviceType] ?? '700px';
}
