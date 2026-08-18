import { useEffect, useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Plus, Edit2, Eye, Loader2 } from 'lucide-react'
import { DataTable } from '@/shared/components/common/data-table'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Progress } from '@/shared/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import DeleteConfirmationDialog from '@/shared/components/common/delete-confirm-dialog'
import { cn } from '@/shared/lib/utils'
import { completionBarColor, completionColor, KPI_TASK_STATUS, type KpiTask } from '@/entities/kpi'
import { useGetKpiTasks, useDeleteKpiTask, useGetKpiTask } from '../model/use-kpi-tasks'
import { KpiTaskModal } from './kpi-task-modal'
import { KpiTaskDetailModal } from './kpi-task-detail-modal'

export function KpiTasksList() {
  const currentYear = new Date().getFullYear()
  const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3)

  const [year, setYear] = useState(currentYear)
  const [quarter, setQuarter] = useState(currentQuarter)

  const { data = [], isLoading } = useGetKpiTasks(year, quarter)
  const deleteMutation = useDeleteKpiTask()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editTaskId, setEditTaskId] = useState<string | null>(null)
  const [viewTaskId, setViewTaskId] = useState<string | null>(null)

  // Editing needs the full task; the modal opens once it is loaded
  const { data: taskDetail, isLoading: isDetailLoading } = useGetKpiTask(editTaskId ?? '')

  useEffect(() => {
    if (editTaskId && taskDetail && !isDetailLoading) {
      setIsModalOpen(true)
    }
  }, [taskDetail, isDetailLoading, editTaskId])

  const years = useMemo(() => Array.from({ length: 5 }, (_, i) => currentYear - 1 + i), [currentYear])

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
      cell: ({ row }) => <span className="font-medium">{row.original.department_name}</span>,
    },
    {
      accessorKey: 'indicator_count',
      header: 'Indikatorlar',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.submitted_count} / {row.original.indicator_count} to‘ldirilgan
        </span>
      ),
    },
    {
      accessorKey: 'completion_rate',
      header: 'KPI natijasi',
      cell: ({ row }) => {
        const rate = row.original.completion_rate ?? 0

        return (
          <div className="flex w-[140px] items-center gap-2">
            <Progress value={rate} className={cn('h-1.5 flex-1', completionBarColor(rate))} />
            <span className={cn('shrink-0 text-sm font-bold', completionColor(rate))}>{rate.toFixed(1)}%</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Holati',
      cell: ({ row }) => {
        const cfg = KPI_TASK_STATUS[row.original.status]

        if (!cfg) return <Badge variant="secondary">{row.original.status_text}</Badge>

        return (
          <Badge variant={cfg.variant} className="gap-1">
            <cfg.icon className="h-3.5 w-3.5" />
            {cfg.label}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => {
        const task = row.original
        // The backend rejects editing or deleting a task that already has results
        const isLocked = task.has_results

        return (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-blue-500"
              title="Batafsil"
              onClick={() => setViewTaskId(task.id)}
            >
              <Eye className="h-4 w-4" />
            </Button>

            {!isLocked && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-orange-500"
                  title="Tahrirlash"
                  onClick={() => handleEdit(task)}
                  disabled={isDetailLoading && editTaskId === task.id}
                >
                  {isDetailLoading && editTaskId === task.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Edit2 className="h-4 w-4" />
                  )}
                </Button>

                <DeleteConfirmationDialog
                  variant="outline"
                  onConfirm={() => deleteMutation.mutate(task.id)}
                  title="KPI vazifani o‘chirish"
                  description={`"${task.department_name}" bo‘limining ${task.year}-yil ${task.quarter}-chorak KPI vazifasini o‘chirmoqchimisiz?`}
                />
              </>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="mb-4 flex flex-col gap-2 pt-0.5 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Vazifa qo‘shish
        </Button>

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

      <DataTable data={data} columns={columns} isLoading={isLoading} className="flex-1" />

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

      <KpiTaskDetailModal taskId={viewTaskId} onClose={() => setViewTaskId(null)} />
    </div>
  )
}
