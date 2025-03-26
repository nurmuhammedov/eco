import { DeviceType } from '@/shared/types/enums.ts';
import { useWindowSize } from '@/shared/hooks/use-window-size.ts';

export function getSidebarCollapse() {
  const { deviceType } = useWindowSize();
  return deviceType === DeviceType.TABLET ? 'offcanvas' : 'icon';
}
