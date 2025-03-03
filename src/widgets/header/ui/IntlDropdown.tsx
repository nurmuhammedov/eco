import { Globe } from 'lucide-react';
import { Language } from '@/shared/types/language';
import { Button } from '@/shared/components/ui/button';
import { useLanguage } from '@/shared/hooks/use-language.ts';
import { UZBFlagIcon } from '@/shared/components/SVGIcons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

const systemLanguages = [
  { value: Language.UZ, text: 'Lotin', label: 'Lotin', flag: <UZBFlagIcon /> },
  {
    value: Language.KR,
    text: 'Кирилл',
    label: 'Кирилл',
    flag: <UZBFlagIcon />,
  },
];

const IntlDropdown = () => {
  const { language, setLanguage } = useLanguage();

  const selectedLang = systemLanguages.find((item) => item.value === language)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          <Globe /> <span className="!text-sm">{selectedLang.text}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-24">
        {systemLanguages.map((langItem) => (
          <DropdownMenuItem
            key={langItem.value}
            onClick={() => setLanguage(langItem.value)}
          >
            <span className="inline-block rounded-full w-5 h-5">
              {langItem.flag}
            </span>
            {langItem.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default IntlDropdown;
