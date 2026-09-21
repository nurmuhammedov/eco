import { describe, expect, it } from 'vitest'
import { belongsToEndpoint, endpointKey } from './endpoint-key'

describe('endpointKey', () => {
  it('drops the surrounding slashes so both spellings key the same cache', () => {
    expect(endpointKey('/accidents')).toEqual(endpointKey('accidents'))
    expect(endpointKey('/accidents/')).toEqual(['accidents'])
  })

  it('keeps the extra parts in the order they were given', () => {
    expect(endpointKey('/accidents', 'list', { page: 2 })).toEqual(['accidents', 'list', { page: 2 }])
  })
})

describe('belongsToEndpoint', () => {
  it('matches the endpoint however either side spelled the slashes', () => {
    expect(belongsToEndpoint(['accidents'], '/accidents')).toBe(true)
    expect(belongsToEndpoint(['/accidents'], 'accidents')).toBe(true)
  })

  it('matches keys nested under the endpoint', () => {
    expect(belongsToEndpoint(['accidents/injury', 'list'], '/accidents')).toBe(true)
  })

  it('matches an endpoint nested under the key, so a detail is refetched with its list', () => {
    expect(belongsToEndpoint(['accidents'], '/accidents/injury')).toBe(true)
  })

  it('does not match a neighbour that merely starts with the same letters', () => {
    expect(belongsToEndpoint(['accidents-archive'], '/accidents')).toBe(false)
    expect(belongsToEndpoint(['inquiries'], '/accidents')).toBe(false)
  })

  it('ignores keys that do not start with a string', () => {
    expect(belongsToEndpoint([{ scope: 'accidents' }], '/accidents')).toBe(false)
    expect(belongsToEndpoint([], '/accidents')).toBe(false)
  })
})
