import type { Resource, ResourceKey } from 'i18next'
import { SUPPORTED_TRANSLATION_LANGUAGES } from '@/app/config'

export const namespaces: string[] = ['common', 'auth', 'admin', 'accreditation']

export const loadResources = async () => {
  const resources: Resource = {}

  await Promise.all(
    SUPPORTED_TRANSLATION_LANGUAGES.map(async (lng) => {
      resources[lng] = {}
      await Promise.all(
        namespaces.map(async (ns) => {
          try {
            const module = await import(`@/app/i18n/translations/${lng}/${ns}.json`)
            resources[lng][ns] = (module as { default: ResourceKey }).default
          } catch (error) {
            console.error(`Error loading ${lng}/${ns}:`, error)
          }
        })
      )
    })
  )

  return resources
}
