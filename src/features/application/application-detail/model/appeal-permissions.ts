import { ApplicationStatus } from '@/entities/application'
import { ApplicationTypeEnum } from '@/entities/create-application'
import { UserRoles } from '@/entities/user'

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
  'CRANE',
  'CONTAINER',
  'BOILER',
  'ESCALATOR',
  'CABLEWAY',
  'HOIST',
  'PIPELINE',
  'ATTRACTION',
  'LPG_POWERED',
]

export function getAppealDomain(appealType?: string): AppealDomain {
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

export function getAppealPermissions(
  role: UserRoles | undefined,
  appealType: string | undefined,
  status: ApplicationStatus | undefined
): AppealPermissions {
  const domain = getAppealDomain(appealType)
  const actors = getDomainActors(domain)
  const isAccreditation = domain === AppealDomain.ACCREDITATION

  const isAssigner = !!role && role === actors.assigner
  const isExecutor = !!role && role === actors.executor
  const isAgreer = !!role && role === actors.agreer

  return {
    domain,
    isAccreditation,
    canAssign: !isAccreditation && isAssigner && status === ApplicationStatus.NEW,
    canReject: !isAccreditation && isAssigner && status === ApplicationStatus.NEW,
    canExecute: !isAccreditation && isExecutor && status === ApplicationStatus.IN_PROCESS,
    canAgree: !isAccreditation && isAgreer,
  }
}
