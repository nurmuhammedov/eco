import { describe, expect, it } from 'vitest'
import { buildConclusionSchema } from './conclusion-dialog'

describe('buildConclusionSchema', () => {
  const values = { conclusion: 'Obyektga ijobiy xulosa berilgan', conclusionFilePaths: [] as string[] }

  it('lets the committee conclude without a file', () => {
    expect(buildConclusionSchema(true).safeParse(values).success).toBe(true)
  })

  it('still asks FVV and SES for at least one file', () => {
    expect(buildConclusionSchema(false).safeParse(values).success).toBe(false)
    expect(buildConclusionSchema(false).safeParse({ ...values, conclusionFilePaths: ['a.pdf'] }).success).toBe(true)
  })

  it('keeps the text required and the files at ten at most either way', () => {
    expect(buildConclusionSchema(true).safeParse({ ...values, conclusion: '  ' }).success).toBe(false)
    const eleven = Array.from({ length: 11 }, (_, i) => `${i}.pdf`)
    expect(buildConclusionSchema(true).safeParse({ ...values, conclusionFilePaths: eleven }).success).toBe(false)
  })
})
