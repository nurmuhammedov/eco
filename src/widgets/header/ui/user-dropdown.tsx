import { useLogout } from '@/entities/auth';
import { useTranslation } from 'react-i18next';
import { ChevronDown, LogOut } from 'lucide-react';
import { Loader } from '@/shared/components/common';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { useAuth } from '@/shared/hooks/use-auth.ts';
import { getInitials } from '@/shared/utils';

export default function UserDropdown() {
  const { user } = useAuth();
  const { t } = useTranslation('auth');
  const { mutateAsync, isPending } = useLogout();

  const userName = getInitials(user?.name);

  if (isPending) {
    return <Loader isVisible={isPending} />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer">
          <Avatar>
            <AvatarImage src="" alt="@shadcn" />
            <AvatarFallback>{userName}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm">{user?.name}</p>
            <p className="text-sm text-slate-500">{user?.role}</p>
          </div>
          <ChevronDown size={16} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuItem disabled={isPending} className="flex justify-between" onClick={() => mutateAsync()}>
            {t('logout')} <LogOut size={16} />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
