import { describe, expect, it } from 'vitest'
import { APP_ROUTES } from './registry'
import { LEGACY_ROUTES } from './legacy-redirects'

const KNOWN_PATHS = new Set(APP_ROUTES.map(({ path }) => `/${path}`))

// The redirect element is `<LegacyRedirect to="..." />`; the target is its prop.
const targetOf = (element: unknown) => (element as { props: { to: string } }).props.to

describe('legacy redirects', () => {
  it('sends every old address to a route that exists', () => {
    const missing = LEGACY_ROUTES.map(({ element }) => targetOf(element)).filter((to) => !KNOWN_PATHS.has(to))

    expect(missing).toEqual([])
  })

  it('does not shadow an address the registry still answers', () => {
    const shadowed = LEGACY_ROUTES.map(({ path }) => path).filter((path) => KNOWN_PATHS.has(`/${path}`))

    expect(shadowed).toEqual([])
  })

  it('carries the same parameters into the new address', () => {
    const paramsOf = (path: string) => (path.match(/:[A-Za-z0-9_]+/g) ?? []).sort()

    for (const { path, element } of LEGACY_ROUTES) {
      expect(paramsOf(targetOf(element)), path).toEqual(paramsOf(path))
    }
  })
})
