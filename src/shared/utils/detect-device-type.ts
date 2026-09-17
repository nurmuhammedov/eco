import { DeviceType } from '@/shared/types/enums'

export function detectDeviceType(width: number): DeviceType {
  if (width < 768) return DeviceType.MOBILE
  if (width < 1024) return DeviceType.TABLET
  if (width < 1280) return DeviceType.LAPTOP
  if (width < 1536) return DeviceType.DESKTOP
  if (width < 2560) return DeviceType.LARGE_SCREEN
  if (width < 3840) return DeviceType.QHD_2K
  return DeviceType.UHD_4K
}
