export interface Announcement {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
  active: boolean
}

export interface AnnouncementParams {
  page?: number
  size?: number
}
