import { useLogout } from '@/entities/auth/models/auth.fetcher'
import { useTranslation } from 'react-i18next'
import { ChevronDown, LogOut, User } from 'lucide-react'
import { Loader } from '@/shared/components/common'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { useAuth } from '@/shared/hooks/use-auth.ts'
import { UserRoles, UserRoleLabels } from '@/entities/user'
import { truncateString } from '@/shared/lib'
import { Link } from 'react-router-dom'

export default function UserDropdown() {
  const { user } = useAuth()
  const { t } = useTranslation('auth')
  const { mutateAsync, isPending } = useLogout()

  if (isPending) {
    return <Loader isVisible={isPending} />
  }

  const roleLabel = user?.isSupervisor ? 'Inspeksiya boshlig‘i' : user?.isController ? 'Inspeksiya inspektori' : ''

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="group flex cursor-pointer items-center gap-3 transition-opacity">
          <Avatar className="border-border h-10 w-10 border">
            <AvatarImage src="" alt={user?.name || '?'} />
            <AvatarFallback className="bg-neutral-150 text-neutral-900">
              <User size={20} />
            </AvatarFallback>
          </Avatar>
          <div className="hidden flex-col items-start text-left sm:flex">
            <p className="text-foreground line-clamp-2 text-sm leading-tight font-medium">
              {truncateString(user?.name, 50)}
            </p>
            {user?.role && (
              <p className="text-muted-foreground max-w-[150px] truncate text-xs">
                {roleLabel || UserRoleLabels[user?.role] || '?'}
              </p>
            )}
          </div>
          <ChevronDown className="text-muted-foreground hidden h-4 !min-h-4 w-4 !min-w-4 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180 sm:block" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className="sm:hidden">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-tight font-medium">{user?.name}</p>
              {user?.role && (
                <p className="text-muted-foreground text-xs leading-none">
                  {roleLabel || UserRoleLabels[user?.role] || '?'}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
        </div>
        <DropdownMenuGroup>
          {user?.role === UserRoles.LEGAL && (
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profil
              </Link>
            </DropdownMenuItem>
          )}
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
