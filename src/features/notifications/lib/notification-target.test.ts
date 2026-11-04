import { describe, expect, it } from 'vitest'
import { resolveNotificationTarget } from './notification-target'

const API = 'https://ekotizim.cirns.uz'

describe('resolveNotificationTarget', () => {
  it('opens a warning PDF from the API host', () => {
    expect(resolveNotificationTarget('/files/risk-analyses/warnings/1764547200123.pdf', API)).toEqual({
      kind: 'file',
      href: `${API}/files/risk-analyses/warnings/1764547200123.pdf`,
    })
  })

  it('treats a file path without the leading slash as a file', () => {
    expect(resolveNotificationTarget('files/a.pdf', `${API}/`)).toEqual({ kind: 'file', href: `${API}/files/a.pdf` })
  })

  it('keeps an application link as a route', () => {
    expect(resolveNotificationTarget('/applications/detail/42', API)).toEqual({
      kind: 'route',
      href: '/applications/detail/42',
    })
    expect(resolveNotificationTarget('applications/detail/42', API)).toEqual({
      kind: 'route',
      href: '/applications/detail/42',
    })
  })

  it('does not take a route that merely mentions files for a file', () => {
    expect(resolveNotificationTarget('/register/files/1', API)?.kind).toBe('route')
  })

  it('decodes an HTML-escaped query', () => {
    expect(resolveNotificationTarget('/inspections/info?id=1&amp;tin=2', API)).toEqual({
      kind: 'route',
      href: '/inspections/info?id=1&tin=2',
    })
  })

  it('passes an absolute link through', () => {
    expect(resolveNotificationTarget('https://example.uz/a', API)).toEqual({
      kind: 'external',
      href: 'https://example.uz/a',
    })
  })

  it('has nowhere to go without a url', () => {
    expect(resolveNotificationTarget(null, API)).toBeNull()
    expect(resolveNotificationTarget('   ', API)).toBeNull()
  })
})
