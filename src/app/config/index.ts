import { getStorage } from '@/shared/utils'
import { Language } from '@/shared/types/language'
import { SIDEBAR_COOKIE_NAME } from '@/shared/components/ui/sidebar'

export const SIDEBAR_OPEN = getStorage(SIDEBAR_COOKIE_NAME) === 'true'

export const SUPPORTED_TRANSLATION_LANGUAGES: Language[] = [Language.UZ]

/**
 * Fixed rather than read from storage: the only writer was the language
 * switcher, and a stored code with no bundled translations made i18next render
 * raw keys across the whole app until the entry was cleared by hand.
 */
export const DEFAULT_LANG_CODE = Language.UZ
