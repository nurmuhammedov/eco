import { apiClient } from '@/shared/api/api-client'
import { servicesApiClient } from '@/shared/api/services-api-client'
import { apiConfig } from '@/shared/api/constants'
import type { AxiosProgressEvent } from 'axios'
import { useMutation } from '@tanstack/react-query'

/**
 * Which backend receives the file. `services` is the Laravel side; it answers
 * with a path under its own base URL, so the link is completed here and the
 * field holds something that opens as it is.
 */
export type UploadClient = 'main' | 'services'

interface UploadFilesOptions {
  endpoint?: string
  fieldName?: string
  client?: UploadClient
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
}

const DEFAULT_OPTIONS: UploadFilesOptions = {
  endpoint: '/attachments/registry-files',
  fieldName: 'file',
  client: 'main',
}

const CLIENTS = { main: apiClient, services: servicesApiClient }

const servicesBase = String(apiConfig.servicesURL ?? '').replace(/\/$/, '')

export const useUploadFiles = (options?: UploadFilesOptions) => {
  const { endpoint, fieldName, client = 'main', onUploadProgress } = { ...DEFAULT_OPTIONS, ...options }

  return useMutation<string, Error, File[]>({
    mutationFn: async (files: File[]) => {
      const formData = new FormData()
      files.forEach((file) => formData.append(fieldName || 'file', file))

      const response = await CLIENTS[client].post<{ data: string }>(
        endpoint || '/attachments/registry-files',
        formData,
        { 'Content-Type': 'multipart/form-data' },
        onUploadProgress
      )

      if (!response.success) {
        throw new Error(response.message || 'Fayl yuklashda xatolik yuz berdi')
      }

      const path = response.data.data

      return client === 'services' ? `${servicesBase}${path}` : path
    },
  })
}
