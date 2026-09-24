import { apiClient } from '@/shared/api/api-client'

// These endpoints pass the E-IMZO server's answers through unchanged, so the
// shapes below are E-IMZO's rather than the backend's

export interface MobileSignSession {
  documentId: string
  challenge: string
  siteId: string
}

export interface MobileSignStatus {
  status: number
  message?: string
  pkcs7b64?: string
}

/** The signature may sit under any of these names depending on the E-IMZO version */
export interface MobileVerifyResult {
  pkcs7Attached?: string
  pkcs7b64?: string
  pkcs7?: string
  pkcs7Info?: { documentBase64?: string }
}

export const getMobileSign = async (): Promise<MobileSignSession> => {
  const response = await apiClient.post<MobileSignSession>('/e-imzo/mobile/sign')
  return response.data
}

export const getMobileStatus = async (documentId: string): Promise<MobileSignStatus> => {
  const formData = new URLSearchParams()
  formData.append('documentId', documentId)

  const response = await apiClient.post<MobileSignStatus>('/e-imzo/mobile/status', formData, {
    'Content-Type': 'application/x-www-form-urlencoded',
  })
  return response.data
}

export const verifyMobileDocument = async (documentId: string, documentBase64: string) => {
  const response = await apiClient.post<MobileVerifyResult | { data?: MobileVerifyResult }>('/e-imzo/mobile/verify', {
    documentId,
    document: documentBase64,
  })
  const body = response.data

  // Sometimes wrapped in the backend's envelope, sometimes not
  return 'data' in body && body.data ? body.data : (body as MobileVerifyResult)
}
