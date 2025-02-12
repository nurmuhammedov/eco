import { DeviceType } from '@/shared/types/enums';

export function getDeviceType(width: number): DeviceType {
  if (width < 640) return DeviceType.MOBILE;
  if (width < 1024) return DeviceType.TABLET;
  if (width < 1440) return DeviceType.LAPTOP;
  return DeviceType.DESKTOP;
}
