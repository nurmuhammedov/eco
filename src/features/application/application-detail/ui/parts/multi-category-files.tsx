import { FC } from 'react'
import { ApplicationStatus } from '@/entities/application'
import { UserRoles } from '@/entities/user'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import { useHazardousFacilityCategoryDetail } from '@/shared/api/dictionaries'
import FilesSection from './files-section'

interface CategoryFilesProps {
  categoryId: string
  files: any[]
  userRole?: UserRoles
  applicationStatus?: ApplicationStatus
  appealId?: string
}

/**
 * The appeal returns the category id and nothing else, so each accordion looks
 * up its own name - one component per category, since a hook cannot run in a
 * loop.
 */
const CategoryFiles: FC<CategoryFilesProps> = ({ categoryId, files, ...rest }) => {
  const { data: category } = useHazardousFacilityCategoryDetail(categoryId)

  return (
    <DetailCardAccordion.Item
      value={multiCategoryFileValue(categoryId)}
      title={`${category?.name || `Toifa #${categoryId}`} — arizaga biriktirilgan fayllar`}
    >
      <FilesSection files={files} {...rest} edit={true} />
    </DetailCardAccordion.Item>
  )
}

export const multiCategoryFileValue = (categoryId: string) => `appeal_files_${categoryId}`

interface MultiCategoryFilesProps {
  multiCategoryFiles: Record<string, any[]>
  userRole?: UserRoles
  applicationStatus?: ApplicationStatus
  appealId?: string
}

/** One attachment accordion per declared category. */
export const MultiCategoryFiles: FC<MultiCategoryFilesProps> = ({ multiCategoryFiles, ...rest }) => (
  <>
    {Object.entries(multiCategoryFiles).map(([categoryId, files]) => (
      <CategoryFiles key={categoryId} categoryId={categoryId} files={Array.isArray(files) ? files : []} {...rest} />
    ))}
  </>
)
