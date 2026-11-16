import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { EmptyValue } from '@/shared/components/common/empty-value'
import { useLegalOrganizationQuery } from '@/shared/api/dictionaries'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { getDate } from '@/shared/utils/date'
import { CADASTRE_PAGE_SIZE } from '../../model/constants'
import { SIGN_ACTION, WORKFLOW_STATUS } from '../../model/labels'
import { CadastrePassport, WorkflowInstance, WorkflowSlot } from '../../model/types'
import { useCadastrePassport } from '../../model/use-cadastre-passport'

const isBlank = (value: ReactNode) => value === null || value === undefined || value === ''

/**
 * A task only carries its passport's id, so the passport itself is fetched per
 * row - without it every row reads the same and the executor cannot tell which
 * document is waiting. The cells of one row share a query key, so they cost a
 * single request between them.
 */
const PassportCell = ({ id, render }: { id: string; render: (passport: CadastrePassport) => ReactNode }) => {
  const { data, isPending } = useCadastrePassport(id)

  if (isPending) return <Skeleton className="h-4 w-24" />
  if (!data) return <EmptyValue />

  const value = render(data)

  return isBlank(value) ? <EmptyValue /> : <>{value}</>
}

/** The passport carries only the preparer's TIN; rows from one preparer share the lookup. */
const PreparerName = ({ tin }: { tin: number }) => {
  const { data, isPending } = useLegalOrganizationQuery(tin)

  if (isPending) return <Skeleton className="h-4 w-24" />

  return <>{data?.name || <EmptyValue />}</>
}

const texts = (values: unknown[]) => [
  ...new Set(values.filter((value): value is string => typeof value === 'string' && !!value.trim())),
]

const objectsOf = (passport: CadastrePassport) => passport.cadastreData?.preparerData?.objects ?? []

/** The title's location; a passport filed before it existed falls back to its objects' addresses. */
const objectAddress = (passport: CadastrePassport) => {
  const location = passport.cadastreData?.preparerData?.addressLine

  return typeof location === 'string' && location.trim()
    ? location
    : texts(objectsOf(passport).map((object) => object.address)).join('; ')
}

const objectPurpose = (passport: CadastrePassport) =>
  texts(objectsOf(passport).map((object) => object.purpose)).join(', ')

/**
 * Where the FVV or SES review stands. A returned review can leave an older
 * instance behind, so the running one is shown first, else the latest.
 */
const slotStatus = (passport: CadastrePassport, slot: WorkflowSlot) => {
  const instances = (passport.workflows ?? []).filter((workflow) => workflow.slot === slot)
  const workflow = instances.find((item) => item.status === 'IN_PROGRESS') ?? instances.at(-1)

  if (!workflow) return null

  const status = WORKFLOW_STATUS[workflow.status]

  return (
    <div className="flex flex-col items-start gap-1">
      <Badge variant={status?.variant ?? 'secondary'}>{status?.label ?? workflow.status}</Badge>
      {workflow.status === 'IN_PROGRESS' && (
        <span className="text-muted-foreground text-xs">
          {[`${workflow.currentStep} / ${workflow.totalSteps}`, workflow.currentPositionName]
            .filter(Boolean)
            .join(' · ')}
        </span>
      )}
    </div>
  )
}

/** The committee's own verdict once it has signed; until then, whether the passport is waiting on it. */
const committeeStatus = (passport: CadastrePassport) => {
  const review = passport.reviews?.find((item) => item.party === 'COMMITTEE')
  const verdict = review ? SIGN_ACTION[review.signAction] : undefined

  if (verdict) return <Badge variant={verdict.variant}>{verdict.label}</Badge>
  if (passport.status === 'IN_COMMITTEE') return <Badge variant="info">Jarayonda</Badge>

  return null
}

/** The columns the committee listed on 2026-11-16, in its order and wording. */
export const MyTasksTable = () => {
  const navigate = useNavigate()

  const {
    paramsObject: { page = 1, size = CADASTRE_PAGE_SIZE },
  } = useCustomSearchParams()

  const { data, isLoading, totalPages } = usePaginatedData<WorkflowInstance>('/workflow-instances/my-tasks', {
    page,
    size,
    processType: 'CADASTRE_PASSPORT_REVIEW',
  })

  const passportColumn = (
    id: string,
    header: string,
    render: (passport: CadastrePassport) => ReactNode
  ): ExtendedColumnDef<WorkflowInstance, unknown> => ({
    id,
    header,
    cell: ({ row }) => <PassportCell id={row.original.businessId} render={render} />,
  })

  const columns: ExtendedColumnDef<WorkflowInstance, unknown>[] = [
    passportColumn('requestNumber', 'Ariza raqami', (passport) => passport.requestNumber),
    // The customer's approval, as in the main list: the reviewers' time runs from it
    passportColumn('reviewedDate', 'Ariza sanasi', (passport) => getDate(passport.reviewedDate)),
    // The application is over once the committee approves it and the passport is registered
    passportColumn('registrationDate', 'Ariza tugash sanasi', (passport) => getDate(passport.registrationDate)),
    passportColumn('preparerName', 'Ishlab chiquvchi tashkilot nomi', (passport) => (
      <PreparerName tin={passport.preparerTin} />
    )),
    passportColumn('customerName', 'Obyektning nomi', (passport) => passport.customerName),
    passportColumn('customerTin', 'Obyektning STIR raqami', (passport) => passport.customerTin),
    passportColumn('objectAddress', 'Obyektning joylashgan manzili', objectAddress),
    passportColumn('objectPurpose', 'Obyektning vazifasi', objectPurpose),
    passportColumn('sesStatus', 'SEO JSQ holati', (passport) => slotStatus(passport, 'SES')),
    passportColumn('fvvStatus', 'FVV holati', (passport) => slotStatus(passport, 'FVV')),
    passportColumn('committeeStatus', 'SRYXQ holati', committeeStatus),
    {
      id: 'actions',
      header: () => <div className="text-right">Obyektning ma’lumotlarini ko‘rish</div>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DataTableRowActions
            row={row}
            showView
            onView={(target) => navigate(`/cadastre-passports/${target.original.businessId}`)}
          />
        </div>
      ),
    },
  ]

  return (
    <DataTable
      isPaginated
      data={data?.content || []}
      columns={columns}
      isLoading={isLoading}
      pageCount={totalPages}
      defaultPageSize={CADASTRE_PAGE_SIZE}
      className="flex-1"
    />
  )
}
