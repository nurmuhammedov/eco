import { describe, expect, it } from 'vitest'
import { parseCoordinate } from './parse-coordinate'

describe('parseCoordinate', () => {
  it('reads a point stored as text', () => {
    expect(parseCoordinate('41.311, 69.279')).toEqual([41.311, 69.279])
  })

  it('gives nothing for text that is not a point', () => {
    expect(parseCoordinate(undefined)).toBeUndefined()
    expect(parseCoordinate('')).toBeUndefined()
    expect(parseCoordinate('41.311')).toBeUndefined()
    expect(parseCoordinate('Toshkent')).toBeUndefined()
  })
})
