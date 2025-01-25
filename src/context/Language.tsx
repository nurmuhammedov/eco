import { createContext } from 'react';
import type { Language } from '@/shared/types/language';

interface LanguageContextType {
  language: Language;
  setLanguage: (lng: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);
