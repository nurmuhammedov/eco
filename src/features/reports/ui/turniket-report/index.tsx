import React, { useState, useEffect, useMemo } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { GoBack } from '@/shared/components/common'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from 'date-fns'
import { uz } from 'date-fns/locale'
import axios from 'axios'
import { useSearchParams, Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { useData } from '@/shared/hooks'

interface TurniketLog {
  name: string
  userId?: string
  days: {
    sana: string
    kirish_vaqti: string
    chiqish_vaqti: string
    status: string
    umumiy_ishlangan: string
    norma_ishlangan: string
  }[]
}

const EXCLUDED_NAMES = ['Muhammadali', 'Nurmuhammad', 'Xurshid']
const formatWorkTime = (time: string | number | undefined) => {
  if (time === undefined || time === null) return '-'
  const timeStr = time.toString()
  if (timeStr.includes(':')) {
    const [hours = '0', minutes = '00'] = timeStr.split(':')
    return `${hours.startsWith('0') && hours.length > 1 ? hours.substring(1) : hours} s. ${minutes.padStart(2, '0')} min.`
  }
  const minutes = parseInt(timeStr) || 0
  if (minutes < 60) return `0 s. ${minutes.toString().padStart(2, '0')} min.`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h} s. ${m.toString().padStart(2, '0')} min.`
}

const getTotalMinutes = (days: any[], field: string) => {
  return days.reduce((total, log) => {
    const value = log[field]
    if (!value) return total
    if (value.includes(':')) {
      const [h = '0', m = '00'] = value.split(':')
      return total + parseInt(h) * 60 + parseInt(m)
    }
    return total + (parseInt(value) || 0)
  }, 0)
}

const TurniketReport: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentYear = new Date().getFullYear().toString()
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0')

  const year = searchParams.get('year') || currentYear
  const month = searchParams.get('month') || currentMonth

  const [data, setData] = useState<TurniketLog[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!searchParams.get('year') || !searchParams.get('month')) {
      setSearchParams({ year, month }, { replace: true })
    }
  }, [])

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString())
  }, [])

  const months = [
    { value: '01', label: 'Yanvar' },
    { value: '02', label: 'Fevral' },
    { value: '03', label: 'Mart' },
    { value: '04', label: 'Aprel' },
    { value: '05', label: 'May' },
    { value: '06', label: 'Iyun' },
    { value: '07', label: 'Iyul' },
    { value: '08', label: 'Avgust' },
    { value: '09', label: 'Sentabr' },
    { value: '10', label: 'Oktabr' },
    { value: '11', label: 'Noyabr' },
    { value: '12', label: 'Dekabr' },
  ]

  const daysInMonth = useMemo(() => {
    const start = startOfMonth(new Date(parseInt(year), parseInt(month) - 1))
    const end = endOfMonth(start)
    return eachDayOfInterval({ start, end })
  }, [year, month])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const from = format(daysInMonth[0], 'yyyy-MM-dd')
        const to = format(daysInMonth[daysInMonth.length - 1], 'yyyy-MM-dd')
        const response = await axios.get(`https://b-aanp.cirns.uz/api/turniket/logs`, {
          params: { from, to },
        })

        const filteredData = (response.data as TurniketLog[]).filter(
          (employee) => !EXCLUDED_NAMES.some((excluded) => employee.name.toLowerCase().includes(excluded.toLowerCase()))
        )

        setData(filteredData)
      } catch (error) {
        console.error('Turniket ma’lumotlarini yuklashda xatolik:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [year, month, daysInMonth])

  useData('/reports/top-100-organizations')

  const columns = useMemo(() => {
    const cols: any[] = [
      {
        accessorKey: 'name',
        header: 'F.I.SH.',
        id: 'name',
        minSize: 300,
        className: 'sticky left-0 z-20 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)] font-medium',
        cell: ({ row }: any) => {
          const from = format(daysInMonth[0], 'yyyy-MM-dd')
          const to = format(daysInMonth[daysInMonth.length - 1], 'yyyy-MM-dd')
          const userId = row.original.userId || row.original.id // API might return id or userId

          return (
            <div className="flex items-center justify-between gap-2">
              <span className="truncate">{row.original.name}</span>
              {userId && (
                <Link to={`/reports/turniket-logs/${userId}?from=${from}&to=${to}`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Eye size={16} />
                  </Button>
                </Link>
              )}
            </div>
          )
        },
      },
      {
        header: 'Jami umumiy ish soati',
        id: 'total-work',
        size: 150,
        className: 'text-center font-bold bg-blue-50/30 whitespace-nowrap',
        cell: ({ row }: any) => {
          const total = getTotalMinutes(row.original.days, 'umumiy_ishlangan')
          return formatWorkTime(total)
        },
      },
      {
        header: 'Jami norma ish soati',
        id: 'total-norma',
        size: 150,
        className: 'text-center font-bold bg-blue-50/30 whitespace-nowrap',
        cell: ({ row }: any) => {
          const total = getTotalMinutes(row.original.days, 'norma_ishlangan')
          return formatWorkTime(total)
        },
      },
    ]

    daysInMonth.forEach((day) => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const isWeekendDay = isWeekend(day)
      const weekendClass = isWeekendDay ? 'bg-red-50/50' : ''

      cols.push({
        id: `day-${dayStr}`,
        header: format(day, "yyyy 'yil' d MMMM", { locale: uz }),
        className: weekendClass,
        columns: [
          {
            header: 'Kelish',
            id: `in-${dayStr}`,
            size: 80,
            className: weekendClass,
            cell: ({ row }: any) => {
              const log = row.original.days.find((d: any) => d.sana === dayStr)
              if (!log?.kirish_vaqti) return '-'

              const isLate = log.kirish_vaqti >= '09:00:00'
              return (
                <span className={isLate ? 'font-medium text-red-600' : 'font-medium text-green-600'}>
                  {log.kirish_vaqti.substring(0, 5)}
                </span>
              )
            },
          },
          {
            header: 'Ketish',
            id: `out-${dayStr}`,
            size: 80,
            className: weekendClass,
            cell: ({ row }: any) => {
              const log = row.original.days.find((d: any) => d.sana === dayStr)
              if (!log?.chiqish_vaqti) return '-'

              const isEarlyLeave = log.chiqish_vaqti < '18:00:00'
              return (
                <span className={isEarlyLeave ? 'font-medium text-red-600' : 'font-medium text-green-600'}>
                  {log.chiqish_vaqti.substring(0, 5)}
                </span>
              )
            },
          },
          {
            header: 'Umumiy ish soati',
            id: `work-${dayStr}`,
            size: 100,
            className: `font-medium whitespace-nowrap ${weekendClass}`,
            cell: ({ row }: any) => {
              const log = row.original.days.find((d: any) => d.sana === dayStr)
              return formatWorkTime(log?.umumiy_ishlangan)
            },
          },
          {
            header: 'Norma ish soati',
            id: `norma-${dayStr}`,
            size: 100,
            className: `font-medium whitespace-nowrap ${weekendClass}`,
            cell: ({ row }: any) => {
              const log = row.original.days.find((d: any) => d.sana === dayStr)
              const timeStr = log?.norma_ishlangan
              if (!timeStr) return '-'

              const isLow = timeStr < '08:00'
              return <span className={isLow ? 'text-red-600' : 'text-green-600'}>{formatWorkTime(timeStr)}</span>
            },
          },
        ],
      })
    })

    return cols
  }, [daysInMonth])

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <GoBack title="Xodimlarning ishga vaqtida kelishi bo‘yicha hisobot" />
        <div className="flex items-center gap-2">
          <Select value={year} onValueChange={(val) => setSearchParams({ year: val, month })}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Yil" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={month} onValueChange={(val) => setSearchParams({ year, month: val })}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Oy" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-md border bg-white shadow-sm">
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          isPaginated={false}
          showNumeration={false}
          headerCenter={true}
          isHeaderSticky={true}
          initialState={{
            columnPinning: {
              left: ['name'],
            },
          }}
          className="h-full"
        />
      </div>
    </div>
  )
}

export default TurniketReport
