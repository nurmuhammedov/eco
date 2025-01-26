import i18n from 'i18next';
import { setStorage } from '@/shared/utils';
import { currentLanguage } from '@/i18-next';
import { Language } from '@/shared/types/language';
import { LanguageContext } from '@/context/Language';
import React, { useEffect, useMemo, useState } from 'react';
import '@/i18-next';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLang] = useState<Language>(currentLanguage);

  useEffect(() => {
    void i18n.changeLanguage(language);
    setStorage('language', language);
  }, [language]);

  const setLanguage = (lng: Language) => {
    setLang(lng);
  };

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
