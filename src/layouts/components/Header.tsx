// ** UI components **
import { SidebarTrigger } from '@/shared/components/ui/sidebar';

export function Header() {
  return (
    <header className="sticky top-0 shadow bg-white z-10 p-6 w-full">
      <SidebarTrigger className="-ml-1" />
    </header>
  );
}
