import AppLogo from '@/assets/logo.webp';
import { getStorage } from '@/shared/utils';
import { SIDEBAR_COOKIE_NAME } from '@/shared/components/ui/sidebar';

export const APP_LOGO = AppLogo;
export const APP_NAME =
  'Sanoat, radiatsiya va yadro xavfsizligi qo‘mitasi ekotizimi';

export const SIDEBAR_OPEN = getStorage(SIDEBAR_COOKIE_NAME) === 'true';

export const SUPPORTED_TRANSLATION_LANGUAGES = ['uz', 'kr', 'ru', 'en'];

export const DEFAULT_LANG_CODE = 'uz';
