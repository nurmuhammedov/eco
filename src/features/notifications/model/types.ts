export interface NotificationItem {
  id: string
  title: string
  message: string
  url: string | null
  isRead: boolean
  createdAt: string
}
