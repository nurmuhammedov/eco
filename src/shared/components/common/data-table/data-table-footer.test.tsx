import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { DataTable } from './data-table'
import type { ExtendedColumnDef } from './model/column-def'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

interface Item {
  name: string
  managerCount: number
  trainedManagerCount: number | null
}

const rows: Item[] = [
  { name: 'Birinchi', managerCount: 12, trainedManagerCount: 8 },
  { name: 'Ikkinchi', managerCount: 5, trainedManagerCount: null },
]

// Grouped like the Top-100 report: the footer has to line up with the leaf columns
const columns: ExtendedColumnDef<Item>[] = [
  { id: 'name', header: 'Nomi', accessorKey: 'name', footer: () => 'Jami' },
  {
    id: 'manager',
    header: 'Rahbar',
    columns: [
      { id: 'managerCount', header: 'Umumiy', accessorKey: 'managerCount', footer: () => 17 },
      { id: 'trainedManagerCount', header: 'KTNUda o‘qigan', accessorKey: 'trainedManagerCount', footer: () => 8 },
    ],
  },
]

const renderTable = (showFooter: boolean) =>
  render(
    <MemoryRouter>
      <DataTable columns={columns} data={rows} isPaginated={false} showFooter={showFooter} />
    </MemoryRouter>
  )

describe('DataTable footer', () => {
  it('adds an unnumbered totals row under the leaf columns', () => {
    const { container } = renderTable(true)
    const footer = container.querySelector('tfoot')

    expect(footer).not.toBeNull()
    const cells = within(footer as HTMLElement).getAllByRole('cell')
    // the numbering cell stays empty, then name, then the two leaf counts
    expect(cells.map((cell) => cell.textContent)).toEqual(['', 'Jami', '17', '8'])
  })

  it('has no footer unless asked', () => {
    const { container } = renderTable(false)

    expect(container.querySelector('tfoot')).toBeNull()
    expect(screen.getByText('Birinchi')).toBeTruthy()
  })
})
