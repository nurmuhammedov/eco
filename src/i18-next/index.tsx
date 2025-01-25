import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uzTranslation from './translations/uz.json';
import enTranslation from './translations/en.json';
import krTranslation from './translations/kr.json';
import ruTranslation from './translations/ru.json';
import { Language } from '@/shared/types/language';

void i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: uzTranslation },
    en: { translation: enTranslation },
    kr: { translation: krTranslation },
    ru: { translation: ruTranslation },
  },
  lng: localStorage.getItem('language') || Language.UZ,
  fallbackLng: Language.UZ,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
