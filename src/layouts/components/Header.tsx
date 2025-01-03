// ** UI components **
import UserDropdown from '@/layouts/components/UserDropdown';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';

export function Header() {
  return (
    <header className="sticky top-0 shadow flex justify-between items-center bg-white z-10 px-6 py-4 2xl:py-5 w-full">
      <SidebarTrigger className="-ml-1" />
      <UserDropdown />
    </header>
  );
}
