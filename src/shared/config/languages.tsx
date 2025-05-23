import { Language } from '@/shared/types/language';
import { UZBFlagIcon } from '@/shared/components/SVGIcons';

export const SYSTEM_LANGUAGES = [
  { value: Language.UZ, text: 'Lotin', label: 'Lotin', flag: <UZBFlagIcon /> },
  {
    value: Language.KR,
    text: 'Кирилл',
    label: 'Кирилл',
    flag: <UZBFlagIcon />,
  },
] as const;
