import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { format } from 'date-fns'
import type { CraneReportRow } from './types'
import CraneReport from './index'

const useDataMock = vi.fn()

vi.mock('@/shared/hooks', () => ({
  useData: (...args: unknown[]) => useDataMock(...args),
}))

vi.mock('@/shared/api/dictionaries', () => ({
  useChildEquipmentTypes: () => ({
    data: [
      { id: 1, name: 'Avtokran' },
      { id: 2, name: 'Minorali kran' },
    ],
  }),
}))

const types = (autocrane: number, tower: number) => [
  {
    childEquipmentId: 1,
    name: 'Avtokran',
    totalCount: autocrane,
    withPermitCount: 233,
    withoutPermitCount: autocrane - 233,
    registeredCount: 15,
    permitAddedCount: 20,
    permitChangedCount: 10,
    partialCheckActiveCount: 120,
    partialCheckNoDateCount: 3000,
    partialCheckExpiredCount: 1124,
    fullCheckActiveCount: 90,
    fullCheckNoDateCount: 3100,
    fullCheckExpiredCount: 1054,
  },
  {
    childEquipmentId: 2,
    name: 'Minorali kran',
    totalCount: tower,
    withPermitCount: 476,
    withoutPermitCount: tower - 476,
    registeredCount: 7,
    permitAddedCount: 9,
    permitChangedCount: 18,
    partialCheckActiveCount: 400,
    partialCheckNoDateCount: 1000,
    partialCheckExpiredCount: 334,
    fullCheckActiveCount: 380,
    fullCheckNoDateCount: 1050,
    fullCheckExpiredCount: 304,
  },
]

const DATA: CraneReportRow[] = [
  { regionId: null, regionName: "Respublika bo'yicha", totalCount: 8769, types: types(4244, 1734) },
  { regionId: 5, regionName: 'Jizzax viloyati', totalCount: 512, types: types(300, 500) },
]

const renderReport = (search = '') =>
  render(
    <MemoryRouter initialEntries={[`/reports/crane${search}`]}>
      <CraneReport />
    </MemoryRouter>
  )

describe('CraneReport', () => {
  it('asks for today’s work until a period is picked', () => {
    useDataMock.mockReturnValue({ data: DATA, isLoading: false, isError: false })
    renderReport()

    const today = format(new Date(), 'yyyy-MM-dd')
    expect(useDataMock).toHaveBeenCalledWith('/reports/registry/crane', true, { startDate: today, endDate: today })
  })

  it('builds a three-row header with one twelve-column group per crane type the backend sends', () => {
    useDataMock.mockReturnValue({ data: DATA, isLoading: false, isError: false })
    renderReport()

    const head = screen.getAllByRole('rowgroup')[0]
    expect(within(head).getAllByRole('row')).toHaveLength(3)

    expect(within(head).getByText('Hududlar')).toHaveAttribute('rowspan', '3')
    expect(within(head).getByText('Barcha turdagi umumiy kranlar soni')).toHaveAttribute('rowspan', '3')
    expect(within(head).getByText('Avtokran')).toHaveAttribute('colspan', '12')
    expect(within(head).getByText('Minorali kran')).toHaveAttribute('colspan', '12')

    const current = within(head).getAllByText('Hozirgi kun holati')
    const done = within(head).getAllByText('Bajarilgan ishlar')
    expect(current).toHaveLength(2)
    expect(done).toHaveLength(2)
    current.concat(done).forEach((cell) => expect(cell).toHaveAttribute('colspan', '3'))

    expect(within(head).getAllByText('Ruxsatnomasi yo‘qlar')).toHaveLength(2)
    // The technical checks: two groups of three under each type
    expect(within(head).getAllByText('Keyingi qisman texnik ko‘rik sanasi')).toHaveLength(2)
    expect(within(head).getAllByText('Keyingi to‘liq texnik ko‘rik sanasi')).toHaveLength(2)
    expect(within(head).getAllByText('Kiritilmagan')).toHaveLength(4)
  })

  it('shows the technical check counts of each type', () => {
    useDataMock.mockReturnValue({ data: DATA, isLoading: false, isError: false })
    renderReport()

    const [, body] = screen.getAllByRole('rowgroup')
    const cells = within(within(body).getAllByRole('row')[0]).getAllByRole('cell')
    // Region, total, then Avtokran: 3 current, 3 partial check, 3 full check, 3 done
    expect(cells.slice(5, 11).map((cell) => cell.textContent)).toEqual([
      '120',
      '3 000',
      '1 124',
      '90',
      '3 100',
      '1 054',
    ])
  })

  it('narrows the report and its Excel to the crane type picked', () => {
    useDataMock.mockReturnValue({ data: DATA, isLoading: false, isError: false })
    renderReport('?childEquipmentId=2&startDate=2026-11-01&endDate=2026-11-10')

    expect(useDataMock).toHaveBeenCalledWith('/reports/registry/crane', true, {
      startDate: '2026-11-01',
      endDate: '2026-11-10',
      childEquipmentId: '2',
    })
    expect(screen.getByRole('combobox')).toHaveTextContent('Minorali kran')
  })

  it('heads the body with the country total in bold and groups thousands', () => {
    useDataMock.mockReturnValue({ data: DATA, isLoading: false, isError: false })
    renderReport()

    const [, body] = screen.getAllByRole('rowgroup')
    const [total, region] = within(body).getAllByRole('row')

    expect(total).toHaveClass('font-bold')
    expect(within(total).getAllByRole('cell')[0]).toHaveTextContent('Respublika bo‘yicha')
    expect(within(total).getAllByRole('cell')[1].textContent).toBe('8\u00a0769')
    expect(within(total).getAllByRole('cell')[2].textContent).toBe('4\u00a0244')

    expect(region).not.toHaveClass('font-bold')
    // 2 fixed columns + 2 types × 12
    expect(within(region).getAllByRole('cell')).toHaveLength(26)
  })

  it('shows the backend’s message when the period is rejected', () => {
    useDataMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { message: 'Boshlanish sanasi tugash sanasidan keyin bo‘lishi mumkin emas' },
    })
    renderReport()

    expect(screen.getByText('Boshlanish sanasi tugash sanasidan keyin bo‘lishi mumkin emas')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
