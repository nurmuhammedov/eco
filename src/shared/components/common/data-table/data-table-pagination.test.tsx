import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { DataTablePagination } from './data-table-pagination'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

const envelope = (number: number) => ({
  content: [],
  page: { size: 10, number, totalElements: 50, totalPages: 5 },
})

const currentPage = () => document.querySelector('[aria-current="page"]')?.textContent

describe('DataTablePagination', () => {
  // Both backends number pages from zero. When Laravel answered from one, page 1
  // showed as 2 and page 1 could not be reached (fixed on the server, 2026-09-23).
  it('reads the server page number as zero-based', () => {
    render(<DataTablePagination data={envelope(0)} onPageChange={vi.fn()} onPageSizeChange={vi.fn()} />)

    expect(currentPage()).toBe('1')
  })

  it('shows the last page as the last one', () => {
    render(<DataTablePagination data={envelope(4)} onPageChange={vi.fn()} onPageSizeChange={vi.fn()} />)

    expect(currentPage()).toBe('5')
  })

  it('asks for pages one-based, the way the URL holds them', () => {
    const onPageChange = vi.fn()
    render(<DataTablePagination data={envelope(0)} onPageChange={onPageChange} onPageSizeChange={vi.fn()} />)

    fireEvent.click(screen.getByText('2'))

    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
