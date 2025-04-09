import { HFSphere } from '@/shared/types';
import { useTranslatedObject } from '@/shared/hooks';

export function objectToList() {
  const sphereOptions = useTranslatedObject(HFSphere, 'application');
  return { sphereOptions };
}
