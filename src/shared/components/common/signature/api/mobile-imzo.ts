import { apiClient } from '@/shared/api/api-client'

export const getMobileSign = async (): Promise<{ documentId: string; challenge: string; siteId: string }> => {
  const response = await apiClient.post<any>('/e-imzo/mobile/sign')
  return response.data as unknown as any
}

export const getMobileStatus = async (
  documentId: string
): Promise<{ status: number; message?: string; pkcs7b64?: string }> => {
  const formData = new URLSearchParams()
  formData.append('documentId', documentId)

  const response = await apiClient.post<any>('/e-imzo/mobile/status', formData as unknown as object, {
    'Content-Type': 'application/x-www-form-urlencoded',
  })
  return response.data as unknown as any
}

export const verifyMobileDocument = async (documentId: string, documentBase64: string): Promise<any> => {
  const response = await apiClient.post<any>('/e-imzo/mobile/verify', {
    documentId,
    document: documentBase64,
  })
  // apiClient returns { success, status, data }
  return response.data?.data || response.data
}
