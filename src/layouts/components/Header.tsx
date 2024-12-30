// ** UI components **
import { SidebarTrigger } from '@/shared/components/ui/sidebar';

export default function Header() {
  return (
    <header className="shadow bg-white p-6 w-full">
      <SidebarTrigger className="-ml-1" />
    </header>
  );
}
