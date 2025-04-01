import { useContext } from 'react';
import { LanguageContext } from '@/app/context/Language';

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within WithLanguage');
  return context;
};
