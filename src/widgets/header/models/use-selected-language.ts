import { useLanguage } from '@/shared/hooks/use-language';
import { SYSTEM_LANGUAGES } from '@/shared/config/languages';

export const useSelectedLanguage = () => {
  const { language, setLanguage } = useLanguage();
  const selectedLang = SYSTEM_LANGUAGES.find(
    (item) => item.value === language,
  )!;

  return { selectedLang, setLanguage };
};
