import { getStorage } from '@/shared/utils'
import { Language } from '@/shared/types/language'
import { SIDEBAR_COOKIE_NAME } from '@/shared/components/ui/sidebar'

/**
 * Open unless the user has collapsed it before. Comparing the raw value against
 * 'true' treated "never chosen" the same as "chosen closed", so every first
 * visit started with the navigation hidden.
 */
const storedSidebarState = getStorage(SIDEBAR_COOKIE_NAME)

export const SIDEBAR_OPEN = storedSidebarState === null || storedSidebarState === 'true'

export const SUPPORTED_TRANSLATION_LANGUAGES: Language[] = [Language.UZ]

/**
 * Fixed rather than read from storage: the only writer was the language
 * switcher, and a stored code with no bundled translations made i18next render
 * raw keys across the whole app until the entry was cleared by hand.
 */
export const DEFAULT_LANG_CODE = Language.UZ
