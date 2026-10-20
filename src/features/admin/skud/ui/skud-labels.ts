import type { SkudDirection } from '../api/skud.api'

export const DIRECTION_LABELS: Record<SkudDirection, string> = {
  in: 'Kirish',
  out: 'Chiqish',
}

export const DIRECTION_BADGE: Record<SkudDirection, 'success' | 'info'> = {
  in: 'success',
  out: 'info',
}

export const formatDateTime = (value?: string | null) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
