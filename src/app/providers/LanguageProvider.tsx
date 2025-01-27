import { setStorage } from '@/shared/utils';
import { I18nextProvider } from 'react-i18next';
import i18n, { currentLanguage } from '@/i18-next';
import { Language } from '@/shared/types/language';
import { LanguageContext } from '@/context/Language';
import React, { useEffect, useMemo, useState } from 'react';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLang] = useState<Language>(currentLanguage);

  useEffect(() => {
    if (i18n.isInitialized) {
      void i18n.changeLanguage(language);
      setStorage('language', language);
    } else {
      i18n.on('initialized', () => {
        void i18n.changeLanguage(language);
        setStorage('language', language);
      });
    }
  }, [language]);

  const setLanguage = (lng: Language) => setLang(lng);

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageContext.Provider value={value}>
        {children}
      </LanguageContext.Provider>
    </I18nextProvider>
  );
};
