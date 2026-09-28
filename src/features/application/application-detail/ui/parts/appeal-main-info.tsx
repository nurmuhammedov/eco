import DetailRow from '@/shared/components/common/detail-row'
import { getDate } from '@/shared/utils/date'
import { useHazardousFacilityCategoryDictionarySelect } from '@/shared/api/dictionaries'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  APPLICATIONS_DATA,
  IrsUsageType,
  MAIN_APPLICATION_BY_CATEGORY,
  stateService,
} from '@/entities/create-application'
import { ACCREDITATION_SPHERE_LABELS } from '@/shared/constants/accreditation-spheres'
import { HF_HAZARDOUS_SIGN_LABELS, HF_LEGAL_TYPE_LABELS } from '@/shared/constants/hf-attributes'
import { EmptyValue } from '@/shared/components/common/empty-value'
import FileLink from '@/shared/components/common/file-link'
import type { AppealInfoData } from '@/entities/application'
import { TrainedEmployeesRows } from './trained-employees-rows'

interface Props {
  address?: string | null
  /** Kept on the appeal itself rather than in its payload. */
  number?: string | null
  deadline?: string | null
  resolution?: string | null
  basisPath?: string | null
  data?: AppealInfoData | null
  isRegister?: boolean
  /** Staff headcount lives on the registry record, not on the appeal. */
  showStaffCounts?: boolean
  /** Organization whose staff trained at the partner training centre is shown */
  trainedEmployeesTin?: string | number | null
  /** Which object the rows describe: HF, CRANE, IRS, XRAY... */
  type?: string | null
}

/** The label a code is shown under, or the code itself when it has none */
const labelOf = (labels: Record<string, string>, code?: string | null) => (code ? labels[code] || code : undefined)

const STATE_SERVICE_LABELS: Record<string, string> = { ...stateService }

const ACCREDITATION_FIELDS = ['phoneNumber', 'email', 'spheres', 'address']

const ACCREDITATION_TYPES = ['ACCREDIT_EXPERT', 'EXPEND_ACCREDITATION_SCOPE', 'ISSUE_ACCREDITATION_CERT']

const ALLOWED_FIELDS: Record<string, string[]> = {
  XRAY: [
    'phoneNumber',
    'licenseNumber',
    'licenseRegistryNumber',
    'model',
    'licenseDate',
    'regionId',
    'districtId',
    'address',
    'serialNumber',
    'manufacturedYear',
    'stateService',
    // 'servicePeriod',
    'registryNumber',
  ],
  ATTRACTION: [
    'phoneNumber',
    'servicePeriod',
    'attractionName',
    'childEquipmentId',
    'childEquipmentSortId',
    'factory',
    'manufacturedAt',
    'acceptedAt',
    'factoryNumber',
    'country',
    'regionId',
    'districtId',
    'parkName',
    'address',
    'location',
    'riskLevel',
    'type',
    'registryNumber',
    'description',
    'birthDate',
    // 'hazardousFacilityId',
    'oldRegistryNumber',
    // 'partialCheckDate',
    // 'fullCheckDate',
  ],
  HF: [
    'upperOrganization',
    'name',
    'categoryId',
    'hfTypeId',
    'spheres',
    'regionId',
    'districtId',
    'address',
    'location',
    'extraArea',
    'hazardousSubstance',
    'hazardousSign',
    'legalType',
    'cadastreNumber',
    'startedDate',
    'managerCount',
    'engineerCount',
    'workerCount',
    'registryNumber',
    'description',
    // 'sign',
    // 'reasons',
  ],
  ELEVATOR: [
    'phoneNumber',
    'hazardousFacilityId',
    'childEquipmentId',
    'factoryNumber',
    'servicePeriod',
    'factory',
    'model',
    'manufacturedAt',
    'partialCheckDate',
    'fullCheckDate',
    'liftingCapacity',
    'stopCount',
    'sphere',
    'regionId',
    'districtId',
    'address',
    'location',
    'type',
    'registryNumber',
    'description',
    'birthDate',
    'oldRegistryNumber',
  ],
  CRANE: [
    'phoneNumber',
    'hazardousFacilityId',
    'servicePeriod',
    'childEquipmentId',
    'factoryNumber',
    'factory',
    'model',
    'boomLength',
    'liftingCapacity',
    'manufacturedAt',
    'partialCheckDate',
    'fullCheckDate',
    'regionId',
    'districtId',
    'address',
    'location',
    'type',
    'registryNumber',
    'description',
    'birthDate',
    'oldRegistryNumber',
  ],
  CONTAINER: [
    'phoneNumber',
    'hazardousFacilityId',
    'childEquipmentId',
    'servicePeriod',
    'factoryNumber',
    'factory',
    'model',
    'manufacturedAt',
    'partialCheckDate',
    'fullCheckDate',
    'nonDestructiveCheckDate',
    'capacity',
    'environment',
    'pressure',
    'regionId',
    'districtId',
    'address',
    'location',
    'type',
    'registryNumber',
    'description',
    'birthDate',
    'oldRegistryNumber',
  ],
  OIL_CONTAINER: [
    'address',
    'location',
    'childEquipmentId',
    'manufacturedAt',
    'nonDestructiveCheckDate',
    'capacity',
    'registryNumber',
    'servicePeriod',
    'hazardousFacilityId',
  ],
  BOILER: [
    'phoneNumber',
    'hazardousFacilityId',
    'childEquipmentId',
    'factoryNumber',
    'factory',
    'model',
    'manufacturedAt',
    'partialCheckDate',
    'fullCheckDate',
    'nonDestructiveCheckDate',
    'servicePeriod',
    'capacity',
    'environment',
    'pressure',
    'regionId',
    'districtId',
    'address',
    'location',
    'type',
    'registryNumber',
    'description',
    'birthDate',
    'oldRegistryNumber',
  ],
  ESCALATOR: [
    'phoneNumber',
    'hazardousFacilityId',
    'childEquipmentId',
    'factoryNumber',
    'factory',
    'model',
    'manufacturedAt',
    'partialCheckDate',
    'fullCheckDate',
    'passengersPerMinute',
    'length',
    'speed',
    'servicePeriod',
    'height',
    'regionId',
    'districtId',
    'address',
    'location',
    'type',
    'registryNumber',
    'description',
    'birthDate',
    'oldRegistryNumber',
  ],
  PIPELINE: [
    'phoneNumber',
    'hazardousFacilityId',
    'childEquipmentId',
    'factoryNumber',
    'factory',
    'servicePeriod',
    'model',
    'manufacturedAt',
    'partialCheckDate',
    'fullCheckDate',
    'nonDestructiveCheckDate',
    'diameter',
    'thickness',
    'length',
    'pressure',
    'environment',
    'regionId',
    'districtId',
    'address',
    'location',
    'type',
    'registryNumber',
    'description',
    'birthDate',
    'oldRegistryNumber',
  ],
  CHEMICAL_CONTAINER: [
    'phoneNumber',
    'hazardousFacilityId',
    'childEquipmentId',
    'factoryNumber',
    'servicePeriod',
    'factory',
    'model',
    'manufacturedAt',
    'partialCheckDate',
    'fullCheckDate',
    'nonDestructiveCheckDate',
    'capacity',
    'environment',
    'pressure',
    'regionId',
    'districtId',
    'address',
    'location',
    'type',
    'registryNumber',
    'description',
    'birthDate',
    'oldRegistryNumber',
  ],
  HEAT_PIPELINE: [
    'phoneNumber',
    'hazardousFacilityId',
    'childEquipmentId',
    'factoryNumber',
    'factory',
    'model',
    'manufacturedAt',
    'partialCheckDate',
    'fullCheckDate',
    'nonDestructiveCheckDate',
    'servicePeriod',
    'diameter',
    'thickness',
    'length',
    'pressure',
    'temperature',
    'regionId',
    'districtId',
    'address',
    'location',
    'type',
    'registryNumber',
    'description',
    'birthDate',
    'oldRegistryNumber',
  ],
  BOILER_UTILIZER: [
    'phoneNumber',
    'hazardousFacilityId',
    'childEquipmentId',
    'factoryNumber',
    'factory',
    'model',
    'manufacturedAt',
    'partialCheckDate',
    'fullCheckDate',
    'nonDestructiveCheckDate',
    'capacity',
    'environment',
    'servicePeriod',
    'pressure',
    'density',
    'temperature',
    'regionId',
    'districtId',
    'address',
    'location',
    'type',
    'registryNumber',
    'description',
    'birthDate',
    'oldRegistryNumber',
  ],
  LPG_CONTAINER: [
    'phoneNumber',
    'hazardousFacilityId',
    'childEquipmentId',
    'factoryNumber',
    'factory',
    'model',
    'manufacturedAt',
    'partialCheckDate',
    'fullCheckDate',
    'nonDestructiveCheckDate',
    'capacity',
    'environment',
    'pressure',
    'regionId',
    'districtId',
    'address',
    'location',
    'servicePeriod',
    'type',
    'registryNumber',
    'description',
    'birthDate',
    'oldRegistryNumber',
  ],
  LPG_POWERED: [
    'phoneNumber',
    'hazardousFacilityId',
    'childEquipmentId',
    'factoryNumber',
    'factory',
    'model',
    'manufacturedAt',
    'partialCheckDate',
    'fullCheckDate',
    'capacity',
    'pressure',
    'fuel',
    'regionId',
    'districtId',
    'servicePeriod',
    'address',
    'location',
    'type',
    'registryNumber',
    'description',
    'birthDate',
    'oldRegistryNumber',
  ],
  HOIST: [
    'phoneNumber',
    'hazardousFacilityId',
    'childEquipmentId',
    'factoryNumber',
    'factory',
    'model',
    'manufacturedAt',
    'partialCheckDate',
    'fullCheckDate',
    'servicePeriod',
    'height',
    'liftingCapacity',
    'regionId',
    'districtId',
    'address',
    'location',
    'type',
    'registryNumber',
    'description',
    'birthDate',
    'oldRegistryNumber',
  ],
  CABLEWAY: [
    'phoneNumber',
    'hazardousFacilityId',
    'childEquipmentId',
    'factoryNumber',
    'factory',
    'model',
    'manufacturedAt',
    'servicePeriod',
    'partialCheckDate',
    'fullCheckDate',
    'nonDestructiveCheckDate',
    'speed',
    'passengerCount',
    'length',
    'regionId',
    'districtId',
    'address',
    'location',
    'type',
    'registryNumber',
    'description',
    'birthDate',
    'oldRegistryNumber',
  ],
  IRS: [
    'phoneNumber',
    'parentOrganization',
    'supervisorName',
    'supervisorPosition',
    // 'servicePeriod',
    'supervisorStatus',
    'supervisorEducation',
    'supervisorPhoneNumber',
    'division',
    'identifierType',
    'symbol',
    'sphere',
    'factoryNumber',
    'serialNumber',
    'activity',
    'type',
    'category',
    'country',
    'manufacturedAt',
    'acceptedFrom',
    'acceptedAt',
    'isValid',
    'usageType',
    'storageLocation',
    'regionId',
    'districtId',
    'address',
    'registryNumber',
  ],
  CHECK_DECLARATION: [
    'number',
    'legalTin',
    'hfRegistryNumber',
    'phoneNumber',
    'sourceType',
    'deadline',
    'resolution',
    'basisPath',
    'address',
  ],
  ACCREDIT_EXPERT: ACCREDITATION_FIELDS,
  EXPEND_ACCREDITATION_SCOPE: ACCREDITATION_FIELDS,
  ISSUE_ACCREDITATION_CERT: ACCREDITATION_FIELDS,
}

const AppealMainInfo: FC<Props> = ({
  type,
  data,
  address,
  number,
  deadline,
  resolution,
  basisPath,
  isRegister = false,
  showStaffCounts = false,
  trainedEmployeesTin,
}) => {
  const { t } = useTranslation()

  const serviceName =
    Object.values(MAIN_APPLICATION_BY_CATEGORY)
      .flat()
      .find((i) => i.id === data?.stateService)?.title ||
    APPLICATIONS_DATA.find((i) => i.type === data?.stateService)?.title ||
    labelOf(STATE_SERVICE_LABELS, data?.stateService)

  const USAGE_TYPE_MAP: Record<string, string> = {
    [IrsUsageType.USAGE]: 'Ishlatish (foydalanish) uchun',
    [IrsUsageType.DISPOSAL]: 'Ko‘mish uchun',
    [IrsUsageType.EXPORT]: 'Chet-elga olib chiqish uchun',
    [IrsUsageType.STORAGE]: 'Vaqtinchalik saqlash uchun',
  }

  const SOURCE_TYPE_MAP: Record<string, string> = {
    MY_GOV: 'MyGov portali',
    SYSTEM: 'Tizim',
    CABINET: 'Shaxsiy kabinet',
  }

  const RISK_LEVEL_MAP: Record<string, string> = {
    I: 'I daraja',
    II: 'II daraja',
    III: 'III daraja',
    IV: 'IV daraja',
  }

  const usageTypeName = labelOf(USAGE_TYPE_MAP, data?.usageType)

  const isAccreditation = !!type && ACCREDITATION_TYPES.includes(type)

  // A declaration check carries the applicant's own details rather than an
  // object of its own, so it has nothing in common with the rows below.
  const isDeclarationCheck = type === 'CHECK_DECLARATION'

  /**
   * A multi-sector facility declares several categories and no single one, so
   * categoryName comes back empty; the names are looked up from the dictionary
   * the multi-category selector reads.
   */
  const multiCategoryIds = data?.multiCategoryIds || []
  const { data: multiCategories = [] } = useHazardousFacilityCategoryDictionarySelect(multiCategoryIds.length > 0)

  const categoryValue =
    data?.categoryName ||
    multiCategoryIds
      .map((id) => multiCategories.find((item) => String(item.id) === String(id))?.name || `Toifa #${id}`)
      .join(', ')

  const allowedFields = (type && ALLOWED_FIELDS[type]) || []

  const isAllowed = (field: string) => allowedFields.includes(field)

  const renderRow = (labelKey: string, value: ReactNode) => {
    if (!isAllowed(labelKey)) return null

    return <DetailRow key={labelKey} title={t(`labels.${type}.${labelKey}`)} value={value || <EmptyValue />} />
  }

  const renderDate = (labelKey: string, value?: string | null) => renderRow(labelKey, getDate(value))

  return (
    <div className="flex flex-col py-1">
      {/* Umumiy ma’lumotlar */}

      {/* XICHO (HF) maydonlari */}
      {isDeclarationCheck && (
        <>
          {renderRow('number', number)}
          {renderRow('legalTin', data?.legalTin)}
          {renderRow('hfRegistryNumber', data?.hfRegistryNumber)}
          {renderRow('phoneNumber', data?.phoneNumber)}
          {renderRow('sourceType', labelOf(SOURCE_TYPE_MAP, data?.sourceType))}
          {renderRow('deadline', getDate(deadline))}
          {renderRow('address', address)}
          {renderRow('resolution', resolution)}
          {renderRow('basisPath', basisPath ? <FileLink url={basisPath} /> : null)}
        </>
      )}

      {renderRow('upperOrganization', data?.upperOrganization)}
      {renderRow('name', data?.name)}
      {isAllowed('categoryId') &&
        renderRow('categoryId', categoryValue || <span className="font-medium text-red-500">Tanlanmagan</span>)}
      {renderRow('hfTypeId', data?.hfTypeName)}
      {isAllowed('spheres') &&
        !isAccreditation &&
        renderRow('spheres', data?.spheres?.map((item) => t('application.' + item)).join(', '))}

      {isAccreditation && (
        <>
          {renderRow('phoneNumber', data?.phoneNumber)}
          {renderRow('email', data?.email)}
          {!!data?.spheres?.length &&
            renderRow('spheres', data.spheres.map((item) => ACCREDITATION_SPHERE_LABELS[item] || item).join('; '))}
        </>
      )}
      {renderRow('extraArea', data?.extraArea)}
      {renderRow('hazardousSubstance', data?.hazardousSubstance)}
      {renderRow('hazardousSign', labelOf(HF_HAZARDOUS_SIGN_LABELS, data?.hazardousSign))}
      {renderRow('legalType', labelOf(HF_LEGAL_TYPE_LABELS, data?.legalType))}
      {renderRow('cadastreNumber', data?.cadastreNumber)}
      {renderDate('startedDate', data?.startedDate)}
      {renderRow('sign', data?.sign)}

      {/* Qurilmalar uchun umumiy maydonlar */}
      {isAllowed('hazardousFacilityId') && (
        <DetailRow
          title={t(`labels.${type}.hazardousFacilityId`)}
          value={
            data?.hfName ? (
              <Link
                to={`/register/hf/${data?.hfId || data?.hazardousFacilityId}`}
                className="text-[#0271FF] hover:underline"
              >
                {data.hfName}
              </Link>
            ) : (
              <EmptyValue />
            )
          }
        />
      )}
      {renderRow('childEquipmentId', data?.childEquipmentName)}
      {renderRow('factoryNumber', data?.factoryNumber)}
      {renderRow('factory', data?.factory)}
      {renderRow('model', data?.model)}
      {renderDate('manufacturedAt', data?.manufacturedAt)}
      {renderDate('partialCheckDate', data?.partialCheckDate)}
      {renderDate('fullCheckDate', data?.fullCheckDate)}
      {renderDate('servicePeriod', data?.servicePeriod)}

      {/* Rentgen (XRAY) maydonlari */}
      {renderRow('licenseNumber', data?.licenseNumber)}
      {renderRow('licenseRegistryNumber', data?.licenseRegistryNumber)}
      {renderDate('licenseDate', data?.licenseDate)}
      {renderDate('licenseExpiryDate', data?.licenseExpiryDate)}
      {renderRow('serialNumber', data?.serialNumber)}
      {renderRow('manufacturedYear', data?.manufacturedYear)}
      {renderRow('stateService', serviceName || data?.stateService)}

      {/* INM (IRS) maydonlari */}
      {renderRow('parentOrganization', data?.parentOrganization)}
      {renderRow('supervisorName', data?.supervisorName)}
      {renderRow('supervisorPosition', data?.supervisorPosition)}
      {renderRow('supervisorStatus', data?.supervisorStatus)}
      {renderRow('supervisorEducation', data?.supervisorEducation)}
      {renderRow('supervisorPhoneNumber', data?.supervisorPhoneNumber)}
      {renderRow('division', data?.division)}
      {renderRow('identifierType', data?.identifierType)}
      {renderRow('symbol', data?.symbol)}
      {renderRow('activity', data?.activity)}
      {renderRow('category', data?.category)}
      {renderRow('country', data?.country)}
      {renderRow('acceptedFrom', data?.acceptedFrom)}
      {renderDate('acceptedAt', data?.acceptedAt)}
      {isAllowed('isValid') &&
        renderRow('isValid', data?.isValid !== undefined ? (data?.isValid ? 'Aktiv' : 'Aktiv emas') : null)}
      {renderRow('usageType', usageTypeName || data?.usageType)}
      {renderRow('storageLocation', data?.storageLocation)}

      {/* Maxsus parametrlar (parameters ichidagilar va top-leveldagilar) */}
      {renderRow('boomLength', data?.parameters?.boomLength)}
      {renderRow('liftingCapacity', data?.parameters?.liftingCapacity || data?.liftingCapacity)}
      {renderRow('stopCount', data?.parameters?.stopCount)}
      {renderRow('sphere', data?.sphere)}
      {renderRow('capacity', data?.parameters?.capacity)}
      {renderRow('pressure', data?.parameters?.pressure)}
      {renderRow('environment', data?.parameters?.environment)}
      {renderRow('density', data?.parameters?.density)}
      {renderRow('temperature', data?.parameters?.temperature)}
      {renderRow('length', data?.parameters?.length)}
      {renderRow('diameter', data?.parameters?.diameter)}
      {renderRow('thickness', data?.parameters?.thickness)}
      {renderRow('speed', data?.parameters?.speed)}
      {renderRow('passengersPerMinute', data?.parameters?.passengersPerMinute)}
      {renderRow('passengerCount', data?.parameters?.passengerCount)}
      {renderRow('height', data?.parameters?.height)}
      {renderRow('fuel', data?.parameters?.fuel)}
      {renderDate('nonDestructiveCheckDate', data?.nonDestructiveCheckDate)}

      {/* Attraksion uchun maxsus */}
      {renderRow('attractionName', data?.attractionName)}
      {renderRow('childEquipmentSortId', data?.childEquipmentSortName || data?.childEquipmentSortId)}
      {renderRow('riskLevel', labelOf(RISK_LEVEL_MAP, data?.riskLevel))}

      {renderRow('parkName', data?.parkName)}
      {!isDeclarationCheck && renderRow('address', address)}

      {/* Umumiy meta ma’lumotlar */}
      {type == 'IRS' ? renderRow('type', data?.type || '') : renderRow('type', t(`equipment_types.${type}`) || type)}
      {isRegister ? renderRow('registryNumber', data?.registryNumber) : null}

      {/* Xodimlar */}
      {(type !== 'HF' || showStaffCounts) && (data?.managerCount || data?.engineerCount || data?.workerCount) && (
        <>
          {isAllowed('managerCount') && renderRow('managerCount', data?.managerCount)}
          {isAllowed('engineerCount') && renderRow('engineerCount', data?.engineerCount)}
          {isAllowed('workerCount') && renderRow('workerCount', data?.workerCount)}
        </>
      )}

      {trainedEmployeesTin && <TrainedEmployeesRows tinNumber={trainedEmployeesTin} />}
    </div>
  )
}

export default AppealMainInfo
