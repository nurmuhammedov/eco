import { format } from 'date-fns'
import { Badge } from '@/shared/components/ui/badge'
import FileLink from '@/shared/components/common/file-link'
import { PARTY_LABELS, SIGN_ACTION } from '../../model/labels'
import { CadastreReview } from '../../model/types'

export const ReviewsList = ({ reviews }: { reviews: CadastreReview[] }) => {
  if (!reviews.length) return <p className="text-muted-foreground py-4 text-center text-sm">Hali xulosalar yo‘q</p>

  return (
    <ul className="divide-y divide-neutral-100">
      {reviews.map((review, index) => {
        const action = SIGN_ACTION[review.signAction]

        return (
          <li key={`${review.party}-${index}`} className="space-y-2 py-3 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-neutral-900">{PARTY_LABELS[review.party] ?? review.party}</span>
              {action && <Badge variant={action.variant}>{action.label}</Badge>}
              {review.createdAt && (
                <span className="text-muted-foreground text-xs">
                  {format(new Date(review.createdAt), 'dd.MM.yyyy HH:mm')}
                </span>
              )}
            </div>
            {review.reviewerName && <p className="text-sm text-neutral-600">{review.reviewerName}</p>}
            {review.conclusion && (
              <p className="rounded-md bg-neutral-50 px-3 py-2 text-sm whitespace-pre-line text-neutral-800">
                {review.conclusion}
              </p>
            )}
            {!!review.conclusionFilePaths?.length && (
              <ul className="space-y-1">
                {review.conclusionFilePaths.map((path, fileIndex) => (
                  <li key={path}>
                    <FileLink
                      url={path}
                      title={review.conclusionFilePaths!.length > 1 ? `Xulosa ${fileIndex + 1}` : 'Xulosa'}
                    />
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  )
}
