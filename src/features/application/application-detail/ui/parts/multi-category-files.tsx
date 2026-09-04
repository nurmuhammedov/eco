import { FC } from 'react'
import { ApplicationStatus } from '@/entities/application'
import { UserRoles } from '@/entities/user'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import { useHazardousFacilityCategoryDictionarySelect } from '@/shared/api/dictionaries'
import FilesSection from './files-section'

export const multiCategoryFileValue = (categoryId: string) => `appeal_files_${categoryId}`

interface MultiCategoryFilesProps {
  multiCategoryFiles: Record<string, any[]>
  userRole?: UserRoles
  applicationStatus?: ApplicationStatus
  appealId?: string
  /** The registry detail renders the same sets under its own rules. */
  register?: boolean
}

/**
 * One attachment accordion per declared category. The appeal returns category
 * ids only, so the names come from the same dictionary the multi-category
 * selector reads - one request for all of them rather than one per accordion.
 */
export const MultiCategoryFiles: FC<MultiCategoryFilesProps> = ({ multiCategoryFiles, ...rest }) => {
  const { data: categories = [] } = useHazardousFacilityCategoryDictionarySelect(true)

  const nameOf = (categoryId: string) =>
    (categories as any[]).find((item) => String(item.id) === String(categoryId))?.name || `Toifa #${categoryId}`

  return (
    <>
      {Object.entries(multiCategoryFiles).map(([categoryId, files]) => (
        <DetailCardAccordion.Item
          key={categoryId}
          value={multiCategoryFileValue(categoryId)}
          title={`${nameOf(categoryId)} fayllari`}
        >
          <FilesSection files={Array.isArray(files) ? files : []} {...rest} edit={!rest.register} />
        </DetailCardAccordion.Item>
      ))}
    </>
  )
}
