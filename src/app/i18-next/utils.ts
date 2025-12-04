import { SUPPORTED_TRANSLATION_LANGUAGES } from '@/app/config'

export const namespaces: string[] = ['common', 'auth', 'admin', 'accreditation']

export const loadResources = async () => {
  const resources: Record<string, any> = {}

  await Promise.all(
    SUPPORTED_TRANSLATION_LANGUAGES.map(async (lng) => {
      resources[lng] = {}
      await Promise.all(
        namespaces.map(async (ns) => {
          try {
            const module = await import(`@/app/i18-next/translations/${lng}/${ns}.json`)
            resources[lng][ns] = module.default
          } catch (error) {
            console.error(`Error loading ${lng}/${ns}:`, error)
          }
        })
      )
    })
  )

  return resources
}
