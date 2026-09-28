import { describe, expect, it } from 'vitest'
import { staffFields } from './committee-staffs.schema'

const pin = staffFields.pin

describe('staff PIN', () => {
  it('takes fourteen digits as typed', () => {
    expect(pin.safeParse('12312123123123').success).toBe(true)
    expect(pin.safeParse(' 32507901230018 ').success).toBe(true)
  })

  it('rejects anything else', () => {
    expect(pin.safeParse('1231212312312').success).toBe(false)
    expect(pin.safeParse('123121231231234').success).toBe(false)
    expect(pin.safeParse('1231212312312a').success).toBe(false)
    expect(pin.safeParse('').success).toBe(false)
  })
})
