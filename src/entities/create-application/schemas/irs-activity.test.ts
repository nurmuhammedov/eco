import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { irsActivitySchema } from './irs-activity'
import { IrsAppealDtoSchema } from './register-irs.schema'
import { RegisterIllegalIrsSchema } from './register-illegal-irs.schema'

const parse = (value: unknown) => irsActivitySchema.safeParse(value)

/** The object a schema's refinements are wrapped around */
const objectOf = (schema: z.ZodTypeAny): z.AnyZodObject => {
  let inner = schema
  while (inner instanceof z.ZodEffects) inner = inner.innerType()
  return inner as z.AnyZodObject
}

describe('irsActivitySchema', () => {
  it('is what both IRS registration forms check the activity with', () => {
    for (const schema of [IrsAppealDtoSchema, RegisterIllegalIrsSchema]) {
      expect(objectOf(schema).shape.activity).toBe(irsActivitySchema)
    }
  })

  // A number in the form turned 2.68E+09 into 2680000000, next to records reading 2.40E+11 (2026-11-10)
  it('keeps the activity as the text that was typed', () => {
    for (const value of ['2680000000', '2.40E+11', '1.02e10', '9.30E-09', '0.5']) {
      expect(parse(value)).toEqual({ success: true, data: value })
    }
  })

  it('trims the value and turns a decimal comma into a point', () => {
    expect(parse('  2,68E+09 ')).toEqual({ success: true, data: '2.68E+09' })
  })

  it('takes nothing but a positive number', () => {
    for (const value of [
      '',
      '   ',
      'abc',
      '-5',
      '0',
      '0.0',
      '2.4.1',
      'E11',
      '2.4E',
      '1e999',
      '2 680 000 000',
      '2,4·10^11',
    ]) {
      expect(parse(value).success, value).toBe(false)
    }
  })

  it('asks for a value when there is none', () => {
    expect(parse(undefined).error?.issues[0].message).toBe('Majburiy maydon!')
  })
})
