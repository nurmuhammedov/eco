import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import type { FileDto } from '@/shared/types'
import { fillFromProfile, hasIncompleteFiles, requireProfileFiles, withProfileFiles } from './radiation-profile-files'

const file = (path: string | null, expiryDate: string | null): FileDto => ({
  path,
  expiryDate,
  number: null,
  uploadDate: null,
})

describe('requireProfileFiles', () => {
  const schema = z.object({
    name: z.string(),
    file1Path: z.string().optional(),
    file1ExpiryDate: z.date().optional(),
  })

  it('asks for every listed field the form left empty', () => {
    const result = requireProfileFiles(schema, ['file1Path', 'file1ExpiryDate']).safeParse({ name: 'INM' })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => [issue.path[0], issue.message])).toEqual([
      ['file1Path', 'Majburiy maydon!'],
      ['file1ExpiryDate', 'Majburiy maydon!'],
    ])
  })

  it('lets the form through once they are given', () => {
    const result = requireProfileFiles(schema, ['file1Path', 'file1ExpiryDate']).safeParse({
      name: 'INM',
      file1Path: 'a.pdf',
      file1ExpiryDate: new Date(2027, 0, 1),
    })

    expect(result.success).toBe(true)
  })
})

describe('hasIncompleteFiles', () => {
  it('is false without a profile and for complete files', () => {
    expect(hasIncompleteFiles(undefined)).toBe(false)
    expect(hasIncompleteFiles(null)).toBe(false)
    expect(hasIncompleteFiles({ file1Path: file('a.pdf', '2027-01-01') })).toBe(false)
  })

  it('is true when a file lacks its document or its expiry date', () => {
    expect(hasIncompleteFiles({ file1Path: file('a.pdf', null) })).toBe(true)
    expect(hasIncompleteFiles({ file1Path: file(null, '2027-01-01') })).toBe(true)
  })
})

describe('fillFromProfile', () => {
  it('sets each file and its expiry date, including files the form has no field for', () => {
    const setValue = vi.fn()

    fillFromProfile(setValue, {
      file1Path: file('a.pdf', '2027-01-01'),
      file3Path: file('b.pdf', null),
      file4Path: file(null, null),
    })

    expect(setValue.mock.calls).toEqual([
      ['file1Path', 'a.pdf', { shouldValidate: true }],
      ['file1ExpiryDate', new Date('2027-01-01'), { shouldValidate: true }],
      ['file3Path', 'b.pdf', { shouldValidate: true }],
    ])
  })
})

describe('withProfileFiles', () => {
  it('keeps what only the form holds and takes the rest from the validated values', () => {
    const formValues = { file3Path: 'b.pdf', manufacturedAt: new Date(2020, 0, 1) }

    expect(withProfileFiles(formValues, { manufacturedAt: '2020-01-01' })).toEqual({
      file3Path: 'b.pdf',
      manufacturedAt: '2020-01-01',
    })
  })
})
