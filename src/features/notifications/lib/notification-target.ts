export type NotificationTarget =
  | { kind: 'route'; href: string }
  | { kind: 'file'; href: string }
  | { kind: 'external'; href: string }

// some URLs are stored HTML-escaped
const decodeStoredUrl = (url: string) =>
  url
    .replace(/&amp;/gi, '&')
    .replace(/&#38;/g, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')

/**
 * Where a notification leads. Most carry a frontend route; the risk-analysis
 * warning carries a backend file path (`/files/...`) served from the API host.
 */
export const resolveNotificationTarget = (
  url: string | null | undefined,
  fileBaseUrl = ''
): NotificationTarget | null => {
  const decoded = url ? decodeStoredUrl(url.trim()) : ''
  if (!decoded) return null

  if (/^https?:\/\//i.test(decoded)) return { kind: 'external', href: decoded }

  const path = decoded.startsWith('/') ? decoded : `/${decoded}`
  if (path.startsWith('/files/')) return { kind: 'file', href: `${fileBaseUrl.replace(/\/+$/, '')}${path}` }

  return { kind: 'route', href: path }
}
