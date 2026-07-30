import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { DataTable } from '@/shared/components/common/data-table'
import { Button } from '@/shared/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { useGetKpiReport } from '../model/use-kpi-report'
import { KpiReportItem } from '../api/kpi-report.api'

import { cn } from '@/shared/lib/utils'

export function KpiReportPage() {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(String(currentYear))
  const [quarter, setQuarter] = useState('1')
  const [selectedReport, setSelectedReport] = useState<KpiReportItem | null>(null)

  const { data = [], isLoading } = useGetKpiReport(year, quarter)

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i)

  const columns: ColumnDef<KpiReportItem>[] = [
    {
      accessorKey: 'department_name',
      header: "Bo'limlar",
    },
    {
      id: 'responsible_employee',
      header: "Mas'ul xodim",
      cell: ({ row }) => (
        <span>{row.original.responsible_name || <span className="text-gray-400">Kiritilmagan</span>}</span>
      ),
    },
    {
      accessorKey: 'kpi_score',
      header: 'KPI natijalari',
      cell: ({ row }) => {
        const val = row.original.kpi_score ?? 0
        const colorClass = val >= 75 ? 'text-green-600' : val >= 50 ? 'text-amber-500' : 'text-red-600'
        return <span className={`font-bold ${colorClass}`}>{val.toFixed(1)}%</span>
      },
    },
    {
      accessorKey: 'status_comment',
      header: 'Izoh',
      cell: ({ row }) => (
        <span className="block max-w-xs truncate text-sm text-gray-600" title={row.original.status_comment || ''}>
          {row.original.status_comment || '—'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-blue-500"
          onClick={() => setSelectedReport(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-start">
        {/* Filter */}
        <div className="flex items-center gap-3 rounded-lg border bg-white p-2.5 shadow-sm">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="h-8 w-28 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}-yil
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={quarter} onValueChange={setQuarter}>
            <SelectTrigger className="h-8 w-32 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((q) => (
                <SelectItem key={q} value={String(q)}>
                  {q}-kvartal
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <DataTable data={data} columns={columns} isLoading={isLoading} />
      </div>

      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>KPI Natijalar tafsilotlari</DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 rounded-md bg-gray-50 p-3 text-sm">
                <div>
                  <p className="text-gray-500">Bo&apos;lim</p>
                  <p className="font-semibold">{selectedReport.department_name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Kvartal</p>
                  <p className="font-semibold">
                    {selectedReport.year}-yil, {selectedReport.quarter}-kvartal
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Umumiy vazn</p>
                  <p className="font-semibold">{selectedReport.total_weight}</p>
                </div>
                <div>
                  <p className="text-gray-500">KPI natijasi</p>
                  <p
                    className={cn(
                      'font-bold',
                      selectedReport.kpi_score >= 75
                        ? 'text-green-600'
                        : selectedReport.kpi_score >= 50
                          ? 'text-amber-500'
                          : 'text-red-600'
                    )}
                  >
                    {selectedReport.kpi_score}%
                  </p>
                </div>
              </div>

              {selectedReport.status_comment && (
                <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
                  <strong>Izoh:</strong> {selectedReport.status_comment}
                </div>
              )}

              <div className="overflow-hidden rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="w-8 p-2 text-left font-medium">T/R</th>
                      <th className="p-2 text-left font-medium">Indikator</th>
                      <th className="w-[120px] p-2 text-left font-medium">Turi</th>
                      <th className="w-[80px] p-2 text-center font-medium">Vazn</th>
                      <th className="w-[80px] p-2 text-center font-medium">Maqsad</th>
                      <th className="w-[80px] p-2 text-center font-medium">Jarima %</th>
                      <th className="p-2 text-right font-medium">Natija</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReport.indicators?.map((ind, idx) => {
                      const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
                        DRAFT: { label: 'Qoralama', cls: 'bg-yellow-100 text-yellow-800' },
                        PENDING: { label: 'Jarayonda', cls: 'bg-blue-100 text-blue-800' },
                        APPROVED: { label: 'Tasdiqlandi', cls: 'bg-green-100 text-green-800' },
                        REJECTED: { label: 'Rad etildi', cls: 'bg-red-100 text-red-800' },
                      }
                      const statusCfg = STATUS_LABELS[ind.status] ?? {
                        label: ind.status,
                        cls: 'bg-gray-100 text-gray-700',
                      }

                      return (
                        <tr key={idx} className="border-t align-top hover:bg-gray-50/30">
                          <td className="p-3 font-medium text-gray-500">{idx + 1}</td>
                          <td className="p-3 font-medium">
                            {ind.indicator_name}
                            {ind.note && (
                              <div className="mt-1 rounded bg-gray-100 p-1.5 text-xs text-gray-500">
                                <strong>Izoh: </strong>
                                {ind.note}
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            {ind.calculation_type === 'PENALTY' ? (
                              <span className="rounded border border-red-100 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
                                Xatolik (Jarima)
                              </span>
                            ) : (
                              <span className="rounded border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
                                Reja bo&apos;yicha
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-center">{ind.weight}</td>
                          <td className="p-3 text-center">{ind.target}</td>
                          <td className="p-3 text-center">
                            {ind.calculation_type === 'PENALTY' && (ind as any).penalty_per_unit != null ? (
                              <span className="font-medium text-red-600">{(ind as any).penalty_per_unit}%</span>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-sm font-semibold">{ind.completion_percent}%</span>
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusCfg.cls}`}>
                                {statusCfg.label}
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
