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

  it('keeps the high-risk link as the backend encoded it', () => {
    const url =
      '/risk-analysis/objects/49662bc3-a612-4c31-8e58-57de9f7e8f07?tin=308639954&name=%22MASTER+GAS-SM%22+MCHJ'
    const target = resolveNotificationTarget(url, API)

    expect(target).toEqual({ kind: 'route', href: url })
    const query = new URLSearchParams(target!.href.split('?')[1])
    expect(query.get('tin')).toBe('308639954')
    expect(query.get('name')).toBe('"MASTER GAS-SM" MCHJ')
  })

  it('reads a Cyrillic name the backend URL-encoded', () => {
    const target = resolveNotificationTarget('/risk-analysis/objects/1?tin=1&name=%D0%9E%D0%9E%D0%9E+%22%D0%90%22', API)
    expect(new URLSearchParams(target!.href.split('?')[1]).get('name')).toBe('ООО "А"')
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
