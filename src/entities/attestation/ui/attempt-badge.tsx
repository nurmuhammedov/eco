import { Badge } from '@/shared/components/ui/badge'

/**
 * A repeat after a failure (resolution No. 26, items 43–44), so the commission
 * sees it at a glance: failing it as well ends the employee's tries.
 */
export const AttemptBadge = ({ attempt }: { attempt?: number | null }) => {
  if (!attempt || attempt < 2) return null

  return (
    <Badge variant="warning" title="Takroriy attestatsiya: bu safar ham o‘tmasa, tashkilotga taqdimnoma yuboriladi">
      Takroriy · {attempt}-urinish
    </Badge>
  )
}
