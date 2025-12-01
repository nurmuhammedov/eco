import UserDropdown from '@/widgets/header/ui/user-dropdown';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';
import { useLocation } from 'react-router-dom';
import Filter from '@/shared/components/common/filter';

export function Header() {
  const { pathname = '' } = useLocation();
  return (
    <header className="sticky top-0 border-b border-neutral-200 flex justify-between items-center bg-white z-10 px-4 3xl:px-6 py-4 3xl:py-5 w-full">
      <div className="flex items-center gap-x-4">
        <SidebarTrigger className="-ml-1" />
        {pathname == '/register' ? (
          <h1 className="text-2xl font-semibold">Reyestrlar</h1>
        ) : pathname == '/applications' ? (
          <h1 className="text-2xl font-semibold">Arizalar</h1>
        ) : pathname == '/permits' ? (
          <h1 className="text-2xl font-semibold">Ruxsatnomalar</h1>
        ) : pathname == '/expertise' ? (
          <h1 className="text-2xl font-semibold">Ekspertiza</h1>
        ) : pathname == '/risk-analysis' ? (
          <h1 className="text-2xl font-semibold">Xavfni tahlil qilish</h1>
        ) : pathname == '/accreditations' ? (
          <h1 className="text-2xl font-semibold">Ekpertiza xulosalari</h1>
        ) : pathname == '/expertise-organizations' ? (
          <h1 className="text-2xl font-semibold">Ekpertiza tashkilotlari</h1>
        ) : pathname == '/inspections' ? (
          <h1 className="text-2xl font-semibold">Tekshiruvlar</h1>
        ) : pathname == '/preventions' ? (
          <h1 className="text-2xl font-semibold">Profilaktika</h1>
        ) : null}
      </div>
      <div className="flex items-center gap-x-4">
        {pathname == '/risk-analysis' || pathname == '/inspections' || pathname == '/preventions' ? (
          <Filter className="mb-0" inputKeys={['year']} />
        ) : null}
        <UserDropdown />
      </div>
    </header>
  );
}
