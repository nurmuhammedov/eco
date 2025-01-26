// ** UI components **
import UserDropdown from '@/layouts/components/UserDropdown';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';
import LanguageSwitcher from '@/layouts/components/IntlDropdown.tsx';

export function Header() {
  return (
    <header className="sticky top-0 border-b border-neutral-200 flex justify-between items-center bg-white z-10 px-6 py-4 2xl:py-5 w-full">
      <SidebarTrigger className="-ml-1" />
      <div className="flex items-center gap-x-4">
        <LanguageSwitcher />
        <UserDropdown />
      </div>
    </header>
  );
}
