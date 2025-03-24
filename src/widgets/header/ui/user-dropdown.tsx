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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';

export default function UserDropdown() {
  const { t } = useTranslation('auth');
  const { mutateAsync, isPending } = useLogout();

  if (isPending) {
    return <Loader isVisible={isPending} />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="text-sm">Doniyor Rahmanov</span>
          <ChevronDown size={16} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={isPending}
            onClick={() => mutateAsync()}
            className="flex justify-between"
          >
            {t('logout')} <LogOut size={16} />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
