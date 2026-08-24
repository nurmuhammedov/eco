import { ArrowLeftRight, Inbox, Check } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles, UserRoleLabels } from '@/entities/user'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import { API_ENDPOINTS } from '@/shared/api'
import { useSwitchOtherRole } from '@/entities/auth/models/auth.fetcher'
import { useSwitchBackRole } from '@/entities/auth/models/auth.fetcher'

export const DelegatedTasksNotification = () => {
  const { user } = useAuth()
  const { mutateAsync: switchOtherRole, isPending } = useSwitchOtherRole()
  const { mutateAsync: switchBackRole, isPending: isSwitchingBack } = useSwitchBackRole()

  const allowedRoles = [
    UserRoles.HEAD,
    UserRoles.MANAGER,
    UserRoles.REGIONAL,
    UserRoles.INSPECTOR,
    'CONTROLLER',
    'SUPERVISOR',
  ]

  const isDelegated = !!user?.delegated || !!user?.delegatorId
  const isEnabled = allowedRoles.includes(user?.role as any) || isDelegated

  const { data: delegationData } = useQuery({
    queryKey: ['user-delegation-me'],
    queryFn: async () => {
      const response = await apiClient.get<any>(API_ENDPOINTS.USER_DELEGATION_ME)
      return response.data?.data || []
    },
    enabled: isEnabled,
  })

  const items = Array.isArray(delegationData) ? delegationData : []
  const totalCount = items.length

  if (!isEnabled || (totalCount === 0 && !isDelegated)) return null

  const displayCount = totalCount + 1

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="border-border bg-neutral-150/50 hover:bg-neutral-150 relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-colors"
        >
          <ArrowLeftRight className="h-[20px] w-[20px] text-neutral-700" />
          <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            {displayCount > 99 ? '99+' : displayCount}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[340px] p-0 shadow-lg">
        <div className="flex items-center justify-between border-b bg-slate-50/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4 text-slate-500" />
            <h4 className="font-semibold text-slate-800">Biriktirilgan vazifalar</h4>
          </div>
          <span className="rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
            {displayCount} ta
          </span>
        </div>
        <div className="max-h-[360px] overflow-y-auto">
          {items.length > 0 ? (
            <div className="flex flex-col">
              {items.map((item: any) => {
                const isSelected = item.delegatorId === user?.delegatorId
                return (
                  <button
                    type="button"
                    key={item.delegatorId}
                    disabled={isPending || isSelected}
                    onClick={() => switchOtherRole(item.delegatorId)}
                    className={`relative flex flex-col gap-1 border-b px-4 py-3 text-left transition-colors last:border-0 hover:bg-slate-50 disabled:opacity-50 ${isSelected ? 'bg-green-50/50' : ''}`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span
                        className={`font-medium ${isSelected ? 'text-green-600' : 'text-blue-600 hover:underline'}`}
                      >
                        {item.delegatorFullName}
                      </span>
                      {isSelected && <Check className="h-4 w-4 text-green-600" />}
                    </div>
                    <span className="text-xs text-slate-500">
                      {item.delegatorRole === 'SUPERVISOR'
                        ? 'Inspeksiya boshlig‘i'
                        : item.delegatorRole === 'CONTROLLER'
                          ? 'Inspeksiya inspektori'
                          : UserRoleLabels[item.delegatorRole as UserRoles] || item.delegatorRole}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 p-8 text-slate-500">
              <div className="rounded-full bg-slate-100 p-3">
                <Inbox className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm">Vazifalar yo‘q</p>
            </div>
          )}
          {isDelegated && (
            <div className="border-t bg-slate-50 p-2">
              <button
                type="button"
                disabled={isSwitchingBack}
                onClick={() => switchBackRole()}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200 disabled:opacity-50"
              >
                <ArrowLeftRight className="h-4 w-4" />
                O'z rolimga o'tish
              </button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
