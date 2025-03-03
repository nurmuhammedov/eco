import { DeviceType } from '@/shared/types/enums';
import { useWindowSize } from '@/shared/hooks/use-window-size.ts';

export function getSidebarCollapse() {
  const { deviceType } = useWindowSize();
  return deviceType === DeviceType.TABLET ? 'offcanvas' : 'icon';
}
