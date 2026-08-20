import { HFSphere } from '@/shared/types'
import { useTranslatedObject } from '@/shared/hooks'

export function useApplicationFormConstants() {
  const spheres = useTranslatedObject(HFSphere, 'application')

  return { spheres }
}
