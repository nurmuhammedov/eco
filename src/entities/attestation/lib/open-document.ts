import { servicesApiClient } from '@/shared/api/services-api-client'
import type { RequestParams } from '@/shared/api/create-api-client'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import { saveBlob } from '@/shared/lib/save-blob'

/** How long a shown PDF stays reachable; the tab keeps its own copy once it has loaded */
const OBJECT_URL_LIFETIME_MS = 60_000

/**
 * Shows a PDF the services API renders. The tab is opened before the request,
 * while the click still counts as the user's, and is pointed at the file once
 * it arrives; when the browser blocks the tab the file is downloaded instead.
 */
export const openAttestationDocument = async (url: string, fileName: string, params?: RequestParams) => {
  const tab = window.open('', '_blank')

  try {
    const response = await servicesApiClient.downloadFile<Blob>(url, params)
    const blob = new Blob([response.data], { type: 'application/pdf' })

    if (!tab) {
      saveBlob(blob, fileName)
      return
    }

    const objectUrl = URL.createObjectURL(blob)
    tab.location.href = objectUrl
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), OBJECT_URL_LIFETIME_MS)
  } catch {
    // The request has already shown its error toast
    tab?.close()
  }
}

/**
 * The same documents are reached through two sets of routes: the commission's,
 * which names the organization, and the organization's own.
 */
export type DocumentAudience = 'commission' | 'organization'

export const attestationDocumentRoutes = (audience: DocumentAudience) =>
  audience === 'commission'
    ? {
        request: SERVICES_API_ENDPOINTS.REQUEST_DOCUMENT,
        calendar: SERVICES_API_ENDPOINTS.CALENDAR_DOCUMENT,
        certificate: SERVICES_API_ENDPOINTS.APPLICATION_CERTIFICATE,
      }
    : {
        request: SERVICES_API_ENDPOINTS.MY_REQUEST_DOCUMENT,
        calendar: SERVICES_API_ENDPOINTS.MY_CALENDAR_DOCUMENT,
        certificate: SERVICES_API_ENDPOINTS.MY_APPLICATION_CERTIFICATE,
      }
