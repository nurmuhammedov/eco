import React, { useState, useEffect, useMemo } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { GoBack } from '@/shared/components/common'
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { uz } from 'date-fns/locale'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'

interface TurniketLog {
  name: string
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

  const columns = useMemo(() => {
    const cols: any[] = [
      {
        accessorKey: 'name',
        header: 'F.I.SH.',
        id: 'name',
        minSize: 250,
        className: 'sticky left-0 z-20 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)] font-medium',
      },
    ]

    daysInMonth.forEach((day) => {
      const dayStr = format(day, 'yyyy-MM-dd')
      cols.push({
        id: `day-${dayStr}`,
        header: format(day, "yyyy 'yil' d MMMM", { locale: uz }),
        columns: [
          {
            header: 'Kelish',
            id: `in-${dayStr}`,
            size: 80,
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
            header: 'Ish soati',
            id: `work-${dayStr}`,
            size: 100,
            className: 'font-medium whitespace-nowrap',
            cell: ({ row }: any) => {
              const log = row.original.days.find((d: any) => d.sana === dayStr)
              const timeStr = log?.umumiy_ishlangan
              if (!timeStr) return '-'

              if (timeStr.includes(':')) {
                const [hours = '0', minutes = '00'] = timeStr.split(':')
                return `${hours} s. ${minutes.padStart(2, '0')} min.`
              }

              const minutes = parseInt(timeStr) || 0
              if (minutes < 60) {
                return `0 s. ${minutes.toString().padStart(2, '0')} min.`
              }

              const h = Math.floor(minutes / 60)
              const m = minutes % 60
              return `${h} s. ${m.toString().padStart(2, '0')} min.`
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
