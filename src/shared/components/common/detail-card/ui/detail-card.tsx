import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card.tsx'
import Icon from '@/shared/components/common/icon'
import type { DetailCardProps } from '../model/detail-card-types'

export const DetailCard = ({ icon, title, children }: DetailCardProps) => {
  return (
    <Card className="rounded-lg">
      <CardHeader className="3xl:py-5 rounded-t-lg bg-blue-200 px-4 py-4">
        <CardTitle className="3xl:text-lg flex items-center gap-2 text-blue-400">
          {icon ?? <Icon name="word" className="3xl:size-6 size-5" />} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2">{children}</CardContent>
    </Card>
  )
}

DetailCard.displayName = 'DetailCard'
