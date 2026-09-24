import { createElement, useMemo, type HTMLAttributes } from 'react'
import DOMPurify from 'dompurify'

// A link opened in a new tab must not hand the new page a handle on this one
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

/** Strips scripts, event handlers and javascript: links, keeping the formatting */
export const sanitizeHtml = (html: string) => DOMPurify.sanitize(html, { ADD_ATTR: ['target'] })

interface SafeHtmlProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'dangerouslySetInnerHTML'> {
  html?: string | null
  as?: 'div' | 'p' | 'span' | 'article'
  /** Shown when there is nothing to render */
  fallback?: string
}

/**
 * Renders HTML that came from the server, such as rich-text editor output.
 * Always goes through here rather than a bare dangerouslySetInnerHTML.
 */
export const SafeHtml = ({ html, as = 'div', fallback = '', ...props }: SafeHtmlProps) => {
  const clean = useMemo(() => (html ? sanitizeHtml(html) : ''), [html])

  return createElement(as, { ...props, dangerouslySetInnerHTML: { __html: clean || fallback } })
}
