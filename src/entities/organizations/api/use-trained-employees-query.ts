import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { getTime } from '@/shared/lib/get-time'
import { ApiResponse } from '@/shared/types/api'

const TRAINED_EMPLOYEES_ENDPOINT = '/integration/ktnu/trained-employees'

/** Staff the organization has had trained at the “Kontexnazoratoʻquv” training centre */
export interface TrainedEmployees {
  managerCount: number | null
  engineerCount: number | null
}

/**
 * Each lookup is a call the backend forwards to the training centre, and a
 * report asks for a hundred organizations at once. Letting them all go out
 * together would queue a hundred calls on that service, so only a few run at a
 * time and the rest wait their turn.
 */
const MAX_IN_FLIGHT = 4
let inFlight = 0
const waiting: (() => void)[] = []

const acquire = () => {
  if (inFlight < MAX_IN_FLIGHT) {
    inFlight++
    return Promise.resolve()
  }
  return new Promise<void>((resolve) => waiting.push(resolve))
}

// The slot goes straight to the next waiter, so nobody can slip in between.
const release = () => {
  const next = waiting.shift()
  if (next) next()
  else inFlight--
}

/** The counts change when a course ends, not from one minute to the next. */
const TRAINED_EMPLOYEES_STALE_TIME = getTime(30, 'minute')

export const useTrainedEmployeesQuery = (tin: string | number | null | undefined) => {
  // A report has the TIN as a number and a registry record as a string; one key serves both.
  const legalTin = tin ? String(tin) : null

  return useQuery({
    queryKey: endpointKey(TRAINED_EMPLOYEES_ENDPOINT, { legalTin }),
    queryFn: async ({ signal }) => {
      await acquire()
      try {
        // A page left while this lookup waited for a slot no longer needs it.
        signal.throwIfAborted()
        const { data } = await apiClient.get<ApiResponse<TrainedEmployees>>(TRAINED_EMPLOYEES_ENDPOINT, { legalTin })
        return data.data ?? null
      } finally {
        release()
      }
    },
    enabled: !!legalTin,
    staleTime: TRAINED_EMPLOYEES_STALE_TIME,
    gcTime: TRAINED_EMPLOYEES_STALE_TIME,
  })
}
