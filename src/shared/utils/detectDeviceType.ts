import { DeviceType } from '@/shared/types/enums'

export function detectDeviceType(width: number): DeviceType {
  if (width < 768) return DeviceType.MOBILE // Tailwind `sm` breakpoint
  if (width < 1024) return DeviceType.TABLET // Tailwind `md` breakpoint
  if (width < 1280) return DeviceType.LAPTOP // Tailwind `lg` breakpoint
  if (width < 1536) return DeviceType.DESKTOP // Tailwind `xl` breakpoint
  if (width < 2560) return DeviceType.LARGE_SCREEN // Tailwind `2xl` breakpoint
  if (width < 3840) return DeviceType.QHD_2K // 2K (Quad HD, 2560x1440)
  return DeviceType.UHD_4K // 4K (Ultra HD, 3840x2160)
}
