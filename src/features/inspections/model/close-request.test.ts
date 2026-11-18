import { describe, expect, it } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import type { ChangeLogEntry } from '@/entities/registry'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { closeRequestStatusOfTab, invalidateCloseRequest, isClosableStatus, latestCloseSending } from './close-request'

const log = (fieldName: string, newValue: string | null, createdAt: string): ChangeLogEntry => ({
  id: `${fieldName}-${createdAt}`,
  fieldName,
  fieldNameUz: null,
  oldValue: null,
  newValue,
  isFile: fieldName === 'closeBasisPath',
  userName: 'Hududiy bo‘lim',
  createdAt,
  updatedAt: createdAt,
  changeId: 'c1',
  status: 'NEW',
})

describe('isClosableStatus', () => {
  it('allows only an inspection that has not been conducted', () => {
    for (const status of ['NEW', 'NOTIFIED', 'NOT_SIGNED', 'ASSIGNED']) expect(isClosableStatus(status)).toBe(true)
    for (const status of ['CONDUCTED', 'CLOSED', 'CODE_ATTACHED', '', null, undefined]) {
      expect(isClosableStatus(status)).toBe(false)
    }
  })
})

describe('latestCloseSending', () => {
  it('reads the file and the comment of a single sending', () => {
    expect(
      latestCloseSending([
        log('closeBasisPath', 'inspections/files/a.pdf', '2026-11-18T10:15:00.100'),
        log('closeComment', 'Korxona faoliyati to‘xtatilgan', '2026-11-18T10:15:00.120'),
      ])
    ).toEqual({ basisPath: 'inspections/files/a.pdf', comment: 'Korxona faoliyati to‘xtatilgan' })
  })

  it('has no comment when none was written', () => {
    expect(latestCloseSending([log('closeBasisPath', 'inspections/files/a.pdf', '2026-11-18T10:15:00')])).toEqual({
      basisPath: 'inspections/files/a.pdf',
      comment: null,
    })
  })

  it('does not carry the comment of a returned sending over to a resending without one', () => {
    const logs = [
      log('closeBasisPath', 'inspections/files/a.pdf', '2026-11-18T10:15:00'),
      log('closeComment', 'Eski izoh', '2026-11-18T10:15:00'),
      log('closeBasisPath', 'inspections/files/b.pdf', '2026-11-19T09:00:00'),
    ]

    expect(latestCloseSending(logs)).toEqual({ basisPath: 'inspections/files/b.pdf', comment: null })
  })

  it('takes the latest sending whatever order the log comes in', () => {
    const logs = [
      log('closeComment', 'Yangi izoh', '2026-11-19T09:00:01'),
      log('closeBasisPath', 'inspections/files/b.pdf', '2026-11-19T09:00:00'),
      log('closeComment', 'Eski izoh', '2026-11-18T10:15:00'),
      log('closeBasisPath', 'inspections/files/a.pdf', '2026-11-18T10:15:00'),
    ]

    expect(latestCloseSending(logs)).toEqual({ basisPath: 'inspections/files/b.pdf', comment: 'Yangi izoh' })
  })

  it('ignores other fields and empty values, and copes with no log at all', () => {
    expect(
      latestCloseSending([
        log('deregisterBasisPath', 'registry/x.pdf', '2026-11-18T10:15:00'),
        log('closeBasisPath', null, '2026-11-18T10:16:00'),
      ])
    ).toEqual({ basisPath: null, comment: null })
    expect(latestCloseSending()).toEqual({ basisPath: null, comment: null })
  })
})

describe('closeRequestStatusOfTab', () => {
  it('turns the requests tab into the status its sub-tab stands for', () => {
    expect(closeRequestStatusOfTab('CLOSE_REQUESTS', 'IN_APPROVAL')).toBe('IN_APPROVAL')
    expect(closeRequestStatusOfTab('CLOSE_REQUESTS', 'IN_PROCESS')).toBe('IN_PROCESS')
  })

  it('opens on the requests awaiting approval', () => {
    for (const closeStatus of ['', null, undefined, 'COMPLETED', 'ASSIGNED']) {
      expect(closeRequestStatusOfTab('CLOSE_REQUESTS', closeStatus)).toBe('IN_APPROVAL')
    }
  })

  it('leaves every other tab to the status filter', () => {
    for (const tab of ['ALL', 'NEW', 'CLOSED', 'ASSIGNED', '', null, undefined]) {
      expect(closeRequestStatusOfTab(tab, 'IN_PROCESS')).toBeUndefined()
    }
  })
})

describe('invalidateCloseRequest', () => {
  it('refetches the inspection, its lists and counts, and the request with its log and history', () => {
    const queryClient = new QueryClient()
    const keys = {
      detail: endpointKey('/inspections', 'i-1'),
      count: endpointKey('/inspections/count', { belongType: 'HF' }),
      request: endpointKey('/changes/by-belong', 'i-1', 'last', 'REGIONAL'),
      log: endpointKey('/change-logs/by-change/c1', { page: 1 }),
      history: endpointKey('/execution-processes/change/c1'),
      unrelated: endpointKey('/hf', 'h-1'),
    }
    Object.values(keys).forEach((key) => queryClient.setQueryData(key, {}))

    invalidateCloseRequest(queryClient)

    const isInvalidated = (key: readonly unknown[]) => queryClient.getQueryState(key)?.isInvalidated
    expect(isInvalidated(keys.detail)).toBe(true)
    expect(isInvalidated(keys.count)).toBe(true)
    expect(isInvalidated(keys.request)).toBe(true)
    expect(isInvalidated(keys.log)).toBe(true)
    expect(isInvalidated(keys.history)).toBe(true)
    expect(isInvalidated(keys.unrelated)).toBe(false)
  })
})
