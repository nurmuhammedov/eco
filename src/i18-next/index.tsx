import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LANG_CODE } from '@/app/config';
import { loadResources, namespaces } from './utils';

const initI18n = async () => {
  const resources = await loadResources();
  await i18n.use(initReactI18next).init({
    resources,
    ns: namespaces,
    defaultNS: 'common',
    fallbackNS: 'common',
    lng: DEFAULT_LANG_CODE,
    fallbackLng: DEFAULT_LANG_CODE,
    interpolation: { escapeValue: false },
    detection: {
      caches: ['localStorage'],
      order: ['localStorage', 'navigator'],
    },
  });
};
void initI18n();

export default i18n;
