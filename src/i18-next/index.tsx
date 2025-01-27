import i18n from 'i18next';
import { getStorage } from '@/shared/utils';
import { initReactI18next } from 'react-i18next';
import { Language } from '@/shared/types/language';
import { loadResources, namespaces } from './utils';

export const currentLanguage =
  (getStorage('language') as Language) || Language.UZ;

const initI18n = async () => {
  const resources = await loadResources();
  await i18n.use(initReactI18next).init({
    defaultNS: 'common',
    lng: currentLanguage,
    fallbackNS: 'common',
    ns: namespaces,
    fallbackLng: Language.UZ,
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
    resources,
  });
};
void initI18n();

export default i18n;
