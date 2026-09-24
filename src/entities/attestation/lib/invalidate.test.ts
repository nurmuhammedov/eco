import { describe, expect, it } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import { invalidateAttestation } from './invalidate'

describe('invalidateAttestation', () => {
  it('refreshes every attestation view and leaves the rest alone', async () => {
    const client = new QueryClient()
    const keys = [
      ['services', '/attestation/applications', { status: 'NEW' }, 'HEAD'],
      ['services', '/attestation/calendars/1/applicants', {}, 'HEAD'],
      ['attestation-calendar', '1'],
      ['attestation-employees'],
      ['services', '/kpi/report', '2026', '3'],
      ['inquiries', { page: 1 }],
    ]
    keys.forEach((key) => client.setQueryData(key, {}))

    await invalidateAttestation(client)

    const stale = keys.map((key) => client.getQueryState(key)?.isInvalidated)
    expect(stale).toEqual([true, true, true, true, false, false])
  })
})
