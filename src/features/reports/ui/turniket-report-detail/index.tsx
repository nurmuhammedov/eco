import React, { useMemo } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { GoBack } from '@/shared/components/common'
import { useParams, useSearchParams } from 'react-router-dom'
import { Card } from '@/shared/components/ui/card'
import { User, Calendar } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { format, parseISO } from 'date-fns'
import { uz } from 'date-fns/locale'
import { cn } from '@/shared/lib/utils'

interface TurniketDetailDay {
  sana: string
  kirish_vaqti: string | null
  chiqish_vaqti: string | null
  status: string
  umumiy_ishlangan: string
  norma_ishlangan: string
}

interface TurniketDetailResponse {
  name: string
  userId: string
  days: TurniketDetailDay[]
}

const formatWorkTime = (time: string | number | undefined) => {
  if (time === undefined || time === null || time === '00:00') return '-'
  const timeStr = time.toString()
  if (timeStr.includes(':')) {
    const [hours = '0', minutes = '00'] = timeStr.split(':')
    const h = parseInt(hours)
    const m = parseInt(minutes)
    if (h === 0 && m === 0) return '-'
    return `${h} s. ${m} min.`
  }
  return timeStr
}

const TurniketReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const { data: reportData, isLoading } = useQuery<TurniketDetailResponse[]>({
    queryKey: ['turniket-detail', id, from, to],
    queryFn: async () => {
      const response = await axios.get('https://b-aanp.cirns.uz/api/turniket_one/logs', {
        params: { from, to, userId: id },
      })
      return response.data
    },
    enabled: !!id,
  })

  const employeeData = useMemo(() => {
    return reportData?.[0]
  }, [reportData])

  const dateInfo = useMemo(() => {
    if (!from) return ''
    try {
      const date = parseISO(from)
      return format(date, 'MMMM yyyy', { locale: uz })
    } catch (e) {
      return ''
    }
  }, [from])

  const columns = [
    {
      header: 'Sana',
      accessorKey: 'sana',
      cell: ({ getValue }: any) => {
        const val = getValue()
        if (!val) return '-'
        try {
          return format(parseISO(val), 'dd.MM.yyyy')
        } catch (e) {
          return val
        }
      },
      size: 150,
    },
    {
      header: 'Kelish',
      accessorKey: 'kirish_vaqti',
      cell: ({ getValue }: any) => {
        const val = getValue()
        if (!val) return '-'
        const time = val.substring(0, 5)
        const isLate = val >= '09:00:00'
        return <span className={cn('font-medium', isLate ? 'text-red-600' : 'text-green-600')}>{time}</span>
      },
      size: 100,
    },
    {
      header: 'Ketish',
      accessorKey: 'chiqish_vaqti',
      cell: ({ getValue }: any) => {
        const val = getValue()
        if (!val) return '-'
        const time = val.substring(0, 5)
        const isEarlyLeave = val < '18:00:00'
        return <span className={cn('font-medium', isEarlyLeave ? 'text-red-600' : 'text-green-600')}>{time}</span>
      },
      size: 100,
    },
    {
      header: 'Umumiy ish soati',
      accessorKey: 'umumiy_ishlangan',
      cell: ({ getValue }: any) => formatWorkTime(getValue()),
      size: 150,
    },
    {
      header: 'Norma ish soati',
      accessorKey: 'norma_ishlangan',
      cell: ({ getValue }: any) => {
        const val = getValue()
        if (!val) return '-'
        const isLow = val < '08:00'
        return <span className={isLow ? 'text-red-600' : 'text-green-600'}>{formatWorkTime(val)}</span>
      },
      size: 150,
    },
  ]

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <GoBack title="Xodimning ishga kelish maʼlumotlari" />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <Card className="flex flex-1 items-center gap-4 border-none bg-white p-4 shadow-sm">
          <div className="rounded-full bg-blue-100 p-3 text-blue-600">
            <User size={24} />
          </div>
          <div>
            <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Xodim</p>
            <h3 className="text-lg font-bold text-gray-800">{employeeData?.name || '...'}</h3>
          </div>
        </Card>

        {dateInfo && (
          <Card className="flex min-w-[200px] items-center gap-4 border-none bg-white p-4 shadow-sm">
            <div className="rounded-full bg-slate-100 p-3 text-slate-600">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Hisobot davri</p>
              <h3 className="text-lg font-bold text-gray-800 capitalize">{dateInfo}</h3>
            </div>
          </Card>
        )}
      </div>

      <Card className="flex-1 overflow-hidden border-none bg-white p-0 shadow-sm">
        <DataTable
          columns={columns}
          data={employeeData?.days || []}
          isLoading={isLoading}
          isPaginated={false}
          showNumeration={false}
          headerCenter={true}
          isHeaderSticky={true}
          className="h-full"
        />
      </Card>
    </div>
  )
}

export default TurniketReportDetail
