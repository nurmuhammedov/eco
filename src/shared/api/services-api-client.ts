import { createApiClient } from './create-api-client'
import { servicesAxiosInstance } from './services-axios-instance'

export const servicesApiClient = createApiClient(servicesAxiosInstance)

/**
 * The services API nests its payload one level deeper than the main one, as
 * `{ data }` inside the body, while a few routes send it bare. This is the one
 * place that tells the two apart.
 */
export const serviceData = <T>(response: { data: unknown }): T => {
  const body = response.data
  const isEnvelope = typeof body === 'object' && body !== null && 'data' in body

  return (isEnvelope ? (body as { data: T }).data : body) as T
}
