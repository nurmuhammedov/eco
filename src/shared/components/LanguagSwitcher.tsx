import React from 'react';
import { useTranslation } from 'react-i18next';
import { Language } from '@/shared/types/language';
import { useLanguage } from '@/shared/hooks/useLanguage';

const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  return (
    <div>
      <h1>{t('hello')}</h1>
      <button
        onClick={() => setLanguage(Language.EN)}
        className={language === Language.EN ? 'font-bold' : ''}
      >
        English
      </button>
      <button
        onClick={() => setLanguage(Language.UZ)}
        className={language === Language.UZ ? 'font-bold' : ''}
      >
        O'zbekcha
      </button>
    </div>
  );
};
export default LanguageSwitcher;
