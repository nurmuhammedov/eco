import { Globe } from 'lucide-react';
import { Language } from '@/shared/types/language.ts';
import { Button } from '@/shared/components/ui/button.tsx';
import { useLanguage } from '@/shared/hooks/useLanguage.ts';
import { UZBFlagIcon } from '@/shared/components/SVGIcons.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu.tsx';

const systemLanguages = [
  { value: Language.KR, text: 'Ўзб', label: 'Ўзбек', flag: <UZBFlagIcon /> },
  { value: Language.UZ, text: "O'zb", label: "O'zbek", flag: <UZBFlagIcon /> },
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
