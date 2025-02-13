import { DeviceType } from '@/shared/types/enums';
import { useWindowSize } from '@/shared/hooks/useWindowSize';

export function getSidebarCollapse() {
  const { deviceType } = useWindowSize();
  return deviceType === DeviceType.DESKTOP ? 'icon' : 'offcanvas';
}
