import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import { NotificationItem } from './types'

export const NOTIFICATIONS_LIST_KEY = ['/notifications']
export const NOTIFICATIONS_COUNT_KEY = ['/notifications/unread-count']

const UNREAD_REFETCH_INTERVAL = 60_000
const PAGE_SIZE = 20

export const useUnreadNotificationCount = (enabled = true) =>
  useQuery({
    queryKey: NOTIFICATIONS_COUNT_KEY,
    enabled,
    refetchInterval: UNREAD_REFETCH_INTERVAL,
    refetchIntervalInBackground: false,
    queryFn: async () => {
      const { data } = await apiClient.get<any>('/notifications/unread-count')
      return Number(data?.data ?? 0)
    },
  })

export const useNotificationList = (enabled = true) =>
  useQuery({
    queryKey: [...NOTIFICATIONS_LIST_KEY, PAGE_SIZE],
    enabled,
    staleTime: 30_000,
    queryFn: async () => {
      const { data } = await apiClient.get<any>('/notifications', { page: 1, size: PAGE_SIZE })
      return (data?.data?.content ?? []) as NotificationItem[]
    },
  })

export const useNotificationActions = () => {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_LIST_KEY })
    queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_COUNT_KEY })
  }

  const markAsRead = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/notifications/${id}/read`, {}),
    onSuccess: invalidate,
  })

  const markAllAsRead = useMutation({
    mutationFn: () => apiClient.patch('/notifications/read-all', {}),
    onSuccess: invalidate,
  })

  return { markAsRead, markAllAsRead }
}
