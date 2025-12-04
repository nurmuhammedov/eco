import { Globe } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { SYSTEM_LANGUAGES } from '@/shared/config/languages'
import { useSelectedLanguage } from '../models/use-selected-language'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

const LanguageDropdown = () => {
  const { selectedLang, setLanguage } = useSelectedLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          <Globe /> <span className="!text-sm">{selectedLang?.text}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-24">
        {SYSTEM_LANGUAGES.map((langItem) => (
          <DropdownMenuItem key={langItem.value} onClick={() => setLanguage(langItem.value)}>
            <span className="inline-block h-5 w-5 rounded-full">{langItem.flag}</span>
            {langItem.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageDropdown
