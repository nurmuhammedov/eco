import { serviceData, servicesApiClient } from '@/shared/api/services-api-client'

export type SkudDirection = 'in' | 'out'

export interface SkudDirectionSlots {
  count: number
  limit: number
  free: number
}

export interface SkudRegion {
  id: number
  name: string
  number: number
  devices: Record<SkudDirection, SkudDirectionSlots>
}

export interface SkudDevice {
  id: string
  region_id: number
  region_name: string | null
  name: string | null
  location: string | null
  direction: SkudDirection
  direction_label: string
  is_active: boolean
  // Only managers (ADMIN, HR) receive the secret address
  token?: string
  push_url?: string
  push_path?: string
  last_seen_at: string | null
  last_event_at: string | null
  last_ip: string | null
  mac_address: string | null
  device_name: string | null
  today_events: number
  created_at: string | null
}

export interface SkudEvent {
  id: number
  time: string | null
  direction: SkudDirection
  person_no: string
  person_name: string | null
  user: { id: string; name: string; username: string } | null
  device: { id: string; name: string | null } | null
  region: { id: number; name: string } | null
}

export interface SkudUnmatched {
  region_id: number
  region_name: string | null
  person_no: string
  person_name: string | null
  count: number
  last_time: string
}

export interface SkudPerson {
  id: string
  name: string
  username: string
  role: string
  region_id: number | null
  region_name: string | null
  numbers: { region_id: number; person_no: string }[]
}

export interface SkudDeviceDTO {
  region_id: number
  direction: SkudDirection
  name?: string | null
  location?: string | null
  is_active?: boolean
}

export interface SkudLinkDTO {
  region_id: number
  person_no: string
  user_id: string | null
}

export const SKUD_ENDPOINT = '/skud'
export const SKUD_REGIONS_ENDPOINT = '/skud/regions'
export const SKUD_DEVICES_ENDPOINT = '/skud/devices'
export const SKUD_EVENTS_ENDPOINT = '/skud/events'
export const SKUD_UNMATCHED_ENDPOINT = '/skud/unmatched'
export const SKUD_PEOPLE_ENDPOINT = '/skud/people'

export const skudAPI = {
  getRegions: async () => serviceData<SkudRegion[]>(await servicesApiClient.get<SkudRegion[]>(SKUD_REGIONS_ENDPOINT)),

  getDevices: async () => serviceData<SkudDevice[]>(await servicesApiClient.get<SkudDevice[]>(SKUD_DEVICES_ENDPOINT)),

  getUnmatched: async () =>
    serviceData<SkudUnmatched[]>(await servicesApiClient.get<SkudUnmatched[]>(SKUD_UNMATCHED_ENDPOINT)),

  getPeople: async () => serviceData<SkudPerson[]>(await servicesApiClient.get<SkudPerson[]>(SKUD_PEOPLE_ENDPOINT)),

  createDevice: (data: SkudDeviceDTO) => servicesApiClient.post<SkudDevice>(SKUD_DEVICES_ENDPOINT, data),

  updateDevice: (id: string, data: Partial<SkudDeviceDTO>) =>
    servicesApiClient.put<SkudDevice>(`${SKUD_DEVICES_ENDPOINT}/${id}`, data),

  deleteDevice: (id: string) => servicesApiClient.delete(`${SKUD_DEVICES_ENDPOINT}/${id}`),

  regenerateToken: (id: string) => servicesApiClient.post<SkudDevice>(`${SKUD_DEVICES_ENDPOINT}/${id}/token`),

  setup: () => servicesApiClient.post<SkudDevice[]>(`${SKUD_DEVICES_ENDPOINT}/setup`),

  link: (data: SkudLinkDTO) => servicesApiClient.post(`${SKUD_ENDPOINT}/link`, data),
}
