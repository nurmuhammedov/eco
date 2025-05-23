import { getStorage } from '@/shared/utils';
import { Language } from '@/shared/types/language';
import { SIDEBAR_COOKIE_NAME } from '@/shared/components/ui/sidebar';

export const SIDEBAR_OPEN = getStorage(SIDEBAR_COOKIE_NAME) === 'true';

export const SUPPORTED_TRANSLATION_LANGUAGES: Language[] = [Language.KR, Language.UZ];

export const DEFAULT_LANG_CODE = (getStorage('language') as Language) || Language.UZ;
