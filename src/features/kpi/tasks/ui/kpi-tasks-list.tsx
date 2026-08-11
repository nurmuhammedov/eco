import { useState, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Plus, Edit2, Eye, Loader2 } from 'lucide-react'
import { DataTable } from '@/shared/components/common/data-table'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useGetKpiTasks, useDeleteKpiTask, useGetKpiTask } from '../model/use-kpi-tasks'
import { KpiTask } from '../api/kpi-tasks.api'
import { KpiTaskModal } from './kpi-task-modal'
import { KpiTaskDetailModal } from './kpi-task-detail-modal'
import DeleteConfirmationDialog from '@/shared/components/common/delete-confirm-dialog'

export function KpiTasksList() {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const [quarter, setQuarter] = useState(1)

  const { data = [], isLoading } = useGetKpiTasks(year, quarter)
  const deleteMutation = useDeleteKpiTask()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editTaskId, setEditTaskId] = useState<string | null>(null)
  const [viewTaskId, setViewTaskId] = useState<string | null>(null)

  // Detail faqat tahrirlashda kerak bo'lganda yuklanadi
  const { data: taskDetail, isLoading: isDetailLoading } = useGetKpiTask(editTaskId ?? '')

  // taskDetail to'liq kelgach modalni ochish
  useEffect(() => {
    if (editTaskId && taskDetail && !isDetailLoading) {
      setIsModalOpen(true)
    }
  }, [taskDetail, isDetailLoading, editTaskId])

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i)

  const handleAdd = () => {
    setEditTaskId(null)
    setIsModalOpen(true)
  }

  const handleEdit = (task: KpiTask) => {
    setIsModalOpen(false)
    setEditTaskId(task.id)
  }

  const columns: ColumnDef<KpiTask>[] = [
    {
      accessorKey: 'department_name',
      header: 'Bo‘lim',
    },
    {
      accessorKey: 'indicator_count',
      header: 'Indikatorlar soni',
      cell: ({ row }) => <Badge variant="outline">{row.original.indicator_count} ta</Badge>,
    },
    {
      accessorKey: 'completion_rate',
      header: 'KPI natijasi',
      cell: ({ row }) => {
        const val = row.original.completion_rate ?? 0
        const colorClass = val >= 75 ? 'text-green-600' : val >= 50 ? 'text-amber-500' : 'text-red-600'
        return <span className={`font-bold ${colorClass}`}>{val.toFixed(1)}%</span>
      },
    },
    {
      accessorKey: 'status_text',
      header: 'Holati',
      cell: ({ row }) => {
        const status = row.original.status_text
        const hasResults = row.original.has_results
        return <Badge className={hasResults ? 'bg-green-500' : 'bg-yellow-500'}>{status}</Badge>
      },
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => {
        const task = row.original
        const hasResults = task.has_results
        return (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-blue-500"
              onClick={() => setViewTaskId(task.id)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {!hasResults && task.status_text !== 'Tasdiqlangan' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-orange-500"
                onClick={() => handleEdit(task)}
                disabled={isDetailLoading && editTaskId === task.id}
              >
                {isDetailLoading && editTaskId === task.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Edit2 className="h-4 w-4" />
                )}
              </Button>
            )}
            {!hasResults && task.status_text !== 'Tasdiqlangan' && (
              <DeleteConfirmationDialog
                variant="outline"
                onConfirm={() => deleteMutation.mutate(task.id)}
                title="KPI Vazifani o‘chirish"
                description={`"${task.department_name}" bo‘limining ${quarter}-chorak KPI vazifasini o‘chirmoqchimisiz?`}
              />
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header & Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Vazifa qo‘shish
        </Button>
        <div className="flex items-center gap-3">
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="h-9 w-28 text-sm">
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

          <Select value={String(quarter)} onValueChange={(v) => setQuarter(Number(v))}>
            <SelectTrigger className="h-9 w-32 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((q) => (
                <SelectItem key={q} value={String(q)}>
                  {q}-chorak
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <DataTable data={data} columns={columns} isLoading={isLoading} className="flex-1" />

      {/* Create/Edit Modal */}
      <KpiTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditTaskId(null)
        }}
        editData={editTaskId && taskDetail ? taskDetail : null}
        defaultYear={year}
        defaultQuarter={quarter}
      />

      {/* Detail View Modal */}
      <KpiTaskDetailModal taskId={viewTaskId} onClose={() => setViewTaskId(null)} />
    </div>
  )
}
