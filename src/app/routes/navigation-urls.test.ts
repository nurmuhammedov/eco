import { describe, expect, it } from 'vitest'
import { APP_ROUTES } from './registry'
import { NAVIGATIONS } from '@/widgets/sidebar/models/navigations'
import { Navigation } from '@/widgets/sidebar/models/types'

const KNOWN_PATHS = new Set(APP_ROUTES.map(({ path }) => `/${path}`))

// Some entries carry a default filter in the query string.
const pathnameOf = (url: string) => url.split(/[?#]/)[0]

const urlsOf = (navigation: Navigation) =>
  navigation.flatMap((item) => (item.items?.length ? item.items.map(({ url }) => url) : [item.url])).map(pathnameOf)

/**
 * A menu entry whose address no route answers sends the reader to "page not
 * found", and nothing else in the build notices: both sides are plain strings.
 */
describe('sidebar navigation', () => {
  for (const [role, navigation] of Object.entries(NAVIGATIONS)) {
    if (!navigation.length) continue

    it(`points ${role} at addresses the router knows`, () => {
      const missing = urlsOf(navigation).filter((url) => !KNOWN_PATHS.has(url))

      expect(missing).toEqual([])
    })
  }

  it('does not send two entries of one menu to the same page', () => {
    for (const [role, navigation] of Object.entries(NAVIGATIONS)) {
      const urls = urlsOf(navigation)

      expect(new Set(urls).size, role).toBe(urls.length)
    }
  })
})
