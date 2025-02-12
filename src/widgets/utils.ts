import { DeviceType } from '@/shared/types/enums';
import { useWindowSize } from '@/shared/utils/useWindowSize';

export function getSidebarCollapse() {
  const { deviceType } = useWindowSize();
  return deviceType === DeviceType.DESKTOP ? 'icon' : 'offcanvas';
}
