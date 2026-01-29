import { useLogout } from '@/entities/auth/models/auth.fetcher'
import { useTranslation } from 'react-i18next'
import { ChevronDown, LogOut, User } from 'lucide-react'
import { Loader } from '@/shared/components/common'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { useAuth } from '@/shared/hooks/use-auth.ts'
import { UserRoleLabels } from '@/entities/user'
import { truncateString } from '@/shared/lib'

export default function UserDropdown() {
  const { user } = useAuth()
  const { t } = useTranslation('auth')
  const { mutateAsync, isPending } = useLogout()

  if (isPending) {
    return <Loader isVisible={isPending} />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="group flex cursor-pointer items-center space-x-2">
          <Avatar className="border-border h-10 w-10 border">
            <AvatarImage src="" alt="@shadcn" />
            <AvatarFallback className="bg-neutral-100 text-neutral-900">
              <User size={20} />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm leading-none font-medium">{truncateString(user?.name)}</p>
            {user?.role && <p className="text-muted-foreground text-xs">{UserRoleLabels[user?.role] || ''}</p>}
          </div>
          <ChevronDown className="text-muted-foreground h-4 w-4 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={isPending}
            className="text-destructive focus:text-destructive flex cursor-pointer items-center"
            onClick={() => mutateAsync()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t('logout')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
