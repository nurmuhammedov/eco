/** AnnouncementDto (`GET /announcements`, `/announcements/{id}`) */
export interface Announcement {
  id: string
  title: string | null
  content: string | null
  isActive: boolean | null
  createdAt: string | null
}

/** AnnouncementUpdateDto; a new announcement is created without the flag */
export interface AnnouncementPayload {
  title: string
  content: string
  isActive: boolean
}
