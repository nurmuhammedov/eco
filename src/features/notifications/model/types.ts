/** NotificationDto (`GET /notifications`) */
export interface NotificationItem {
  id: string
  title: string | null
  message: string | null
  url: string | null
  isRead: boolean | null
  createdAt: string | null
}
