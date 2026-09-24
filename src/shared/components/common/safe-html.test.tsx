import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { SafeHtml } from './safe-html'

// The sanitising itself is not tested here: DOMPurify needs a real DOM parser,
// and happy-dom mangles the markup before DOMPurify ever sees it.
describe('SafeHtml', () => {
  it('renders the fallback when there is no content', () => {
    const { container } = render(<SafeHtml html={null} fallback="-" as="p" />)

    expect(container.querySelector('p')?.textContent).toBe('-')
  })
})
