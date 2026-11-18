import { ApplicationStatus, type ApplicationDetail } from '@/entities/application'
import { ApplicationTypeEnum } from '@/entities/create-application'
import { UserRoles, type UserState } from '@/shared/types/user'

export enum AppealDomain {
  HF_EQUIPMENT = 'HF_EQUIPMENT',
  RADIATION = 'RADIATION',
  ACCREDITATION = 'ACCREDITATION',
  UNKNOWN = 'UNKNOWN',
}

const ACCREDITATION_TYPES: string[] = [
  ApplicationTypeEnum.ACCREDIT_EXPERT,
  ApplicationTypeEnum.RE_ACCREDIT_EXPERT,
  ApplicationTypeEnum.EXPEND_ACCREDITATION_SCOPE,
  ApplicationTypeEnum.RE_ISSUE_ACCREDITATION_CERT,
]

const EQUIPMENT_KEYWORDS = [
  'EQUIPMENT',
  'ELEVATOR',
  'CRANE',
  'CONTAINER',
  'BOILER',
  'ESCALATOR',
  'CABLEWAY',
  'HOIST',
  'PIPELINE',
  'ATTRACTION',
  'LPG_POWERED',
  // Harakatlanuvchi sig'im: REGISTER_TANKER (the inspector's registration too), DEREGISTER_, RE_REGISTER_
  'TANKER',
]

export function getAppealDomain(appealType?: string | null): AppealDomain {
  if (!appealType) return AppealDomain.UNKNOWN
  if (ACCREDITATION_TYPES.includes(appealType)) return AppealDomain.ACCREDITATION
  if (appealType.includes('IRS') || appealType.includes('XRAY')) return AppealDomain.RADIATION
  if (appealType.includes('HF')) return AppealDomain.HF_EQUIPMENT
  if (EQUIPMENT_KEYWORDS.some((keyword) => appealType.includes(keyword))) return AppealDomain.HF_EQUIPMENT
  return AppealDomain.UNKNOWN
}

export interface AppealPermissions {
  domain: AppealDomain
  isAccreditation: boolean
  canAssign: boolean
  canReject: boolean
  canExecute: boolean
  canAgree: boolean
}

function getDomainActors(domain: AppealDomain) {
  switch (domain) {
    case AppealDomain.HF_EQUIPMENT:
      return {
        assigner: UserRoles.REGIONAL,
        executor: UserRoles.INSPECTOR,
        agreer: UserRoles.REGIONAL,
      }
    case AppealDomain.RADIATION:
      return {
        assigner: UserRoles.HEAD,
        executor: UserRoles.MANAGER,
        agreer: UserRoles.HEAD,
      }
    case AppealDomain.ACCREDITATION:
      return { assigner: null, executor: UserRoles.MANAGER, agreer: null }
    default:
      return { assigner: null, executor: null, agreer: null }
  }
}

/**
 * `isOwn` is false when a regional head or an inspector opened an appeal that is
 * not theirs to act on (see `isOwnAppeal`): they may read it, not act on it.
 */
export function getAppealPermissions(
  role: UserRoles | undefined,
  appealType?: string | null,
  status?: ApplicationStatus | null,
  isOwn = true
): AppealPermissions {
  const domain = getAppealDomain(appealType)
  const actors = getDomainActors(domain)
  const isAccreditation = domain === AppealDomain.ACCREDITATION

  const isAssigner = isOwn && !!role && role === actors.assigner
  const isExecutor = isOwn && !!role && role === actors.executor
  const isAgreer = isOwn && !!role && role === actors.agreer

  return {
    domain,
    isAccreditation,
    canAssign: !isAccreditation && isAssigner && status === ApplicationStatus.NEW,
    canReject: !isAccreditation && isAssigner && status === ApplicationStatus.NEW,
    canExecute: !isAccreditation && isExecutor && status === ApplicationStatus.IN_PROCESS,
    canAgree: !isAccreditation && isAgreer,
  }
}

type AppealActor = Pick<UserState, 'role' | 'id' | 'regionId' | 'isSupervisor'>
type AppealScope = Pick<ApplicationDetail, 'regionId' | 'executorId'>

/**
 * The registries are republic-wide, so a regional head or an inspector can open
 * another region's appeal, or one assigned to someone else, while the backend
 * lets them act only on their own (`findByIdAndStatusAndOfficeId`,
 * `findByIdAndStatusAndExecutorId`). A supervisor's reach goes by regulator and
 * is left to the backend, as are the roles that are not scoped at all.
 *
 * An appeal that comes without its region or executor - the backend before it
 * sends them - holds nothing back, so the buttons stay as the role allows.
 */
export function isOwnAppeal(user?: AppealActor | null, appeal?: AppealScope | null): boolean {
  if (!user || !appeal) return true

  if (user.role === UserRoles.REGIONAL && !user.isSupervisor) {
    return appeal.regionId === undefined || appeal.regionId === null || Number(appeal.regionId) === user.regionId
  }

  if (user.role === UserRoles.INSPECTOR) {
    // Sent but empty: the appeal is not assigned to anyone yet, so not to this inspector either
    return appeal.executorId === undefined || appeal.executorId === user.id
  }

  return true
}
