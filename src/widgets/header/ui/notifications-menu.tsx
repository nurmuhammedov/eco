import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDate } from 'date-fns'
import { Bell, CheckCheck, FileText, Inbox, Loader2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { useAuth } from '@/shared/hooks/use-auth'
import { cn } from '@/shared/lib/utils'
import {
  NotificationItem,
  useNotificationActions,
  useNotificationList,
  useUnreadNotificationCount,
} from '@/features/notifications'
import { useInquiryNotifications } from '../model/use-inquiry-notifications'

const GroupLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="bg-slate-50 px-4 py-1.5 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">{children}</p>
)

const decodeStoredUrl = (url: string) =>
  url
    .replace(/&amp;/gi, '&')
    .replace(/&#38;/g, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')

export const NotificationsMenu = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const { data: unreadCount = 0 } = useUnreadNotificationCount(Boolean(user))
  const { data: items = [], isLoading } = useNotificationList(open)
  const { markAsRead, markAllAsRead } = useNotificationActions()
  const { items: inquiries, totalCount: inquiryCount } = useInquiryNotifications()

  if (!user) return null

  const badgeCount = unreadCount + inquiryCount
  const isEmpty = items.length === 0 && inquiries.length === 0

  const handleSelect = (item: NotificationItem) => {
    if (!item.isRead) markAsRead.mutate(item.id)
    setOpen(false)
    if (!item.url) return

    const url = decodeStoredUrl(item.url)

    if (/^https?:\/\//i.test(url)) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      navigate(url.startsWith('/') ? url : `/${url}`)
    }
  }

  const handleInquirySelect = (id: string) => {
    setOpen(false)
    navigate(`/inquiries/detail/${id}`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Bildirishnomalar"
          className="border-border bg-neutral-150/50 hover:bg-neutral-150 relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-colors"
        >
          <Bell className="h-[20px] w-[20px] text-neutral-700" />
          {badgeCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
              {badgeCount > 99 ? '99+' : badgeCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[min(380px,calc(100vw-1.5rem))] p-0 shadow-lg">
        <div className="flex items-center justify-between gap-2 border-b bg-slate-50/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-slate-500" />
            <h4 className="font-semibold text-slate-800">Bildirishnomalar</h4>
            {badgeCount > 0 && (
              <span className="rounded-md bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">{badgeCount}</span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
              className="flex cursor-pointer items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline disabled:opacity-50"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Barchasini o‘qildi
            </button>
          )}
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {isLoading && isEmpty ? (
            <div className="flex items-center justify-center gap-2 p-8 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Yuklanmoqda...
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center gap-2 p-8 text-slate-500">
              <div className="rounded-full bg-slate-100 p-3">
                <Inbox className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm">Bildirishnomalar yo‘q</p>
            </div>
          ) : (
            <>
              {items.length > 0 && (
                <>
                  <GroupLabel>Tizim bildirishnomalari</GroupLabel>
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={cn(
                        'flex w-full cursor-pointer flex-col gap-1 border-b px-4 py-3 text-left transition-colors hover:bg-slate-50',
                        !item.isRead && 'bg-blue-50/40'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-2 font-medium text-slate-800">
                          {!item.isRead && <span className="size-2 shrink-0 rounded-full bg-red-500" />}
                          <span className="truncate">{item.title}</span>
                        </span>
                        <span className="shrink-0 text-xs whitespace-nowrap text-slate-400">
                          {item.createdAt ? formatDate(new Date(item.createdAt), 'dd.MM.yyyy HH:mm') : ''}
                        </span>
                      </div>
                      <span className="line-clamp-2 text-sm text-slate-600">{item.message}</span>
                    </button>
                  ))}
                </>
              )}

              {inquiries.length > 0 && (
                <>
                  <GroupLabel>Murojaatlar</GroupLabel>
                  {inquiries.map((inquiry) => (
                    <button
                      key={inquiry.id}
                      onClick={() => handleInquirySelect(inquiry.id)}
                      className="flex w-full cursor-pointer flex-col gap-1 border-b px-4 py-3 text-left transition-colors last:border-0 hover:bg-slate-50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-2 font-medium text-blue-600">
                          <FileText className="size-3.5 shrink-0" />
                          <span className="truncate">{inquiry.registryNumber || 'Raqamsiz'}</span>
                        </span>
                        <span className="shrink-0 text-xs whitespace-nowrap text-slate-400">
                          {inquiry.createdAt ? formatDate(new Date(inquiry.createdAt), 'dd.MM.yyyy HH:mm') : ''}
                        </span>
                      </div>
                      <span className="line-clamp-1 text-sm text-slate-600">
                        {inquiry.fullName || 'Noma’lum yuboruvchi'}
                      </span>
                    </button>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
