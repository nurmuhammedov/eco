import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import type { Timesheet } from '../api/attendance.api'
import { TimesheetTab } from './timesheet-tab'

const mocks = vi.hoisted(() => ({ canManage: false, saved: [] as unknown[] }))

const days: Timesheet['days'] = [
  { date: '2026-11-01', day: 1, weekday: 'Ya', is_weekend: true, is_workday: false, holiday: null },
  { date: '2026-11-02', day: 2, weekday: 'Du', is_weekend: false, is_workday: true, holiday: null },
  { date: '2026-11-03', day: 3, weekday: 'Se', is_weekend: false, is_workday: true, holiday: null },
  { date: '2026-11-04', day: 4, weekday: 'Ch', is_weekend: false, is_workday: true, holiday: null },
]

const totals = { days: 3, hours: 19, lates: 2, late_minutes: 75, absent: 0, incomplete: 1, business_trip: 1, leave: 0 }

const timesheet: Timesheet = {
  year: 2026,
  month: 11,
  days,
  divisions: [
    {
      code: '00',
      name: 'Markaziy boshqarma',
      totals: { ...totals, employees: 1 },
      employees: [
        {
          user_id: 'u-1',
          name: 'Abdullayev Botir Umarovich',
          short_name: 'Abdullayev B.U.',
          position: 'Bosh mutaxassis',
          department: null,
          rate: 1,
          daily_hours: 8,
          tracked_since: '2026-11-02',
          totals,
          cells: [
            { day: 1, status: 'WEEKEND', code: '' },
            {
              day: 2,
              status: 'PRESENT',
              code: '8',
              flag: 'LATE',
              hours: 8,
              late_minutes: 30,
              check_in: '09:30',
              check_out: '18:30',
            },
            { day: 3, status: 'PRESENT', code: '3', flag: 'LATE_INCOMPLETE', hours: 3, late_minutes: 45 },
            { day: 4, status: 'INCOMPLETE', code: '?', check_in: '09:02', incomplete_reason: 'NO_EXIT' },
          ],
        },
      ],
    },
    {
      code: '10',
      name: 'Samarqand hududiy boshqarmasi',
      totals: { ...totals, employees: 1 },
      employees: [
        {
          user_id: 'u-2',
          name: 'Ahatqulov Murod Saidovich',
          short_name: 'Ahatqulov M.S.',
          position: null,
          department: null,
          rate: 0.5,
          daily_hours: 4,
          tracked_since: null,
          totals: { ...totals, days: 0, hours: 0, lates: 0 },
          cells: days.map((day) => ({ day: day.day, status: day.is_workday ? 'NO_DATA' : 'WEEKEND', code: '' })),
        },
      ],
    },
  ],
  day_totals: [
    { day: 1, hours: 0 },
    { day: 2, hours: 8 },
    { day: 3, hours: 3 },
    { day: 4, hours: 0 },
  ],
  totals: { ...totals, employees: 2 },
}

vi.mock('../model/use-attendance', () => ({
  useAttendanceAccess: () => ({ canManage: mocks.canManage, isRegional: false }),
  useAttendanceSettings: () => ({
    data: {
      work_start: '09:00',
      work_end: '18:00',
      lunch_start: '13:00',
      lunch_minutes: 60,
      late_grace_minutes: 0,
      full_day_hours: 8,
    },
  }),
  useTimesheet: () => ({ data: timesheet, isLoading: false, isFetching: false }),
  useSaveCorrection: () => ({
    isPending: false,
    mutate: (body: unknown, options?: { onSuccess?: () => void }) => {
      mocks.saved.push(body)
      options?.onSuccess?.()
    },
  }),
}))
vi.mock('@/shared/components/common', () => ({
  ExportExcelButton: () => <button type="button">Excelga yuklash</button>,
}))

const renderTab = () =>
  render(
    <MemoryRouter>
      <TimesheetTab filters={{ year: 2026, month: 11, division: '' }} />
    </MemoryRouter>
  )

beforeEach(() => {
  mocks.canManage = false
  mocks.saved = []
})

describe('TimesheetTab', () => {
  it('groups the employees by division, numbered through, with the month totals', () => {
    renderTab()

    expect(screen.getByText('Markaziy boshqarma (1 nafar xodim)')).toBeInTheDocument()
    expect(screen.getByText('Samarqand hududiy boshqarmasi (1 nafar xodim)')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Abdullayev B.U.' })).toHaveAttribute(
      'href',
      '/attendance/employees/u-1?year=2026&month=11'
    )

    const row = screen.getByRole('link', { name: 'Abdullayev B.U.' }).closest('tr') as HTMLElement
    const cells = within(row).getAllByRole('cell')
    expect(cells[0]).toHaveTextContent('1')
    expect(cells.at(-3)).toHaveTextContent('3')
    expect(cells.at(-2)).toHaveTextContent('19')
    expect(cells.at(-1)).toHaveTextContent('2')
  })

  it('paints the late days and tells the details on hover', () => {
    renderTab()

    const row = screen.getByRole('link', { name: 'Abdullayev B.U.' }).closest('tr') as HTMLElement
    const late = within(row).getAllByRole('cell')[4]

    expect(late).toHaveTextContent('8')
    expect(late.className).toContain('bg-amber-200')
    expect(late).toHaveAttribute('title', expect.stringContaining('Kechikish: 30 daqiqa'))
    expect(within(row).getAllByRole('cell')[5].className).toContain('bg-red-200')
    expect(within(row).getAllByRole('cell')[6]).toHaveTextContent('?')
  })

  it('marks a part rate', () => {
    renderTab()

    const row = screen.getByRole('link', { name: 'Ahatqulov M.S.' }).closest('tr') as HTMLElement
    expect(within(row).getAllByRole('cell')[2].className).toContain('bg-amber-100')
  })

  it('finds an employee by name without asking the server again', async () => {
    const user = userEvent.setup()
    renderTab()

    await user.type(screen.getByPlaceholderText('Xodim F.I.Sh.'), 'ahat')

    expect(screen.queryByRole('link', { name: 'Abdullayev B.U.' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ahatqulov M.S.' })).toBeInTheDocument()
  })

  it('lets HR confirm a day without an exit from the timesheet itself', async () => {
    mocks.canManage = true
    const user = userEvent.setup()
    renderTab()

    const row = screen.getByRole('link', { name: 'Abdullayev B.U.' }).closest('tr') as HTMLElement
    await user.click(within(row).getAllByRole('cell')[6])

    expect(screen.getByText('Kun holatini tuzatish')).toBeInTheDocument()
    expect(screen.getByLabelText('Kelgan vaqti')).toHaveValue('09:02')
    expect(screen.getByRole('button', { name: 'Saqlash' })).toBeDisabled()

    await user.type(screen.getByLabelText('Ketgan vaqti'), '18:10')
    await user.type(screen.getByLabelText('Sababi *'), 'Chiqishda qurilma ishlamagan')
    await user.click(screen.getByRole('button', { name: 'Saqlash' }))

    expect(mocks.saved).toEqual([
      {
        user_id: 'u-1',
        date: '2026-11-04',
        status: 'PRESENT',
        check_in: '09:02',
        check_out: '18:10',
        reason: 'Chiqishda qurilma ishlamagan',
      },
    ])
  })

  it('leaves the cells alone for those who only read', async () => {
    const user = userEvent.setup()
    renderTab()

    const row = screen.getByRole('link', { name: 'Abdullayev B.U.' }).closest('tr') as HTMLElement
    await user.click(within(row).getAllByRole('cell')[6])

    expect(screen.queryByText('Kun holatini tuzatish')).not.toBeInTheDocument()
  })
})
