import DetailRow from '@/shared/components/common/detail-row'
import { EmptyValue } from '@/shared/components/common/empty-value'
import { ReviewGroup, formatReviewValue } from '../../model/review-fields'
import { CadastreSection } from '../../model/types'

interface SectionRowsProps {
  groups: ReviewGroup[]
  data: CadastreSection | null | undefined
}

/**
 * The table is shown whether or not the organisation has filled it in - an
 * empty section that renders nothing reads as a missing page rather than as a
 * form still waiting for its turn.
 */
export const SectionRows = ({ groups, data }: SectionRowsProps) => (
  <div className="space-y-4">
    {groups.map((group) => (
      <section key={group.title}>
        <h4 className="mb-2 text-sm font-semibold text-neutral-800">{group.title}</h4>
        {group.fields.map((field) => (
          <DetailRow
            key={field.name}
            title={field.label}
            value={formatReviewValue(field, data?.[field.name]) ?? <EmptyValue />}
          />
        ))}
      </section>
    ))}
  </div>
)
