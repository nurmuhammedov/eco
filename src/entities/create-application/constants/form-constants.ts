import { HFSphere } from '@/shared/types';
import { useTranslatedObject } from '@/shared/hooks';

export function applicationFormConstants() {
  const spheres = useTranslatedObject(HFSphere, 'application');

  return { spheres };
}
