import { describe, expect, it } from 'vitest'
import { previewPdfAddress } from './pdf-preview-dialog'

describe('previewPdfAddress', () => {
  it('finds the address however the answer wraps it', () => {
    expect(previewPdfAddress('/files/cadastre/a.pdf')).toBe('/files/cadastre/a.pdf')
    expect(previewPdfAddress({ success: true, data: '/files/cadastre/a.pdf' })).toBe('/files/cadastre/a.pdf')
    expect(previewPdfAddress({ filePath: '/files/cadastre/a.pdf' })).toBe('/files/cadastre/a.pdf')
    expect(previewPdfAddress({ data: { url: '/files/cadastre/a.pdf' } })).toBe('/files/cadastre/a.pdf')
  })

  it('has none for an empty answer', () => {
    expect(previewPdfAddress(null)).toBeNull()
    expect(previewPdfAddress('')).toBeNull()
    expect(previewPdfAddress({ success: false, data: null })).toBeNull()
  })
})
