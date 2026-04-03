import DetailRow from '@/shared/components/common/detail-row.tsx'
import { getDate } from '@/shared/utils/date.ts'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  APPLICATIONS_DATA,
  IrsUsageType,
  MAIN_APPLICATION_BY_CATEGORY,
  stateService,
} from '@/entities/create-application'

interface Props {
  address: any
  data: any
  isRegister?: boolean
  type: any
}

const ALLOWED_FIELDS: Record<string, string[]> = {
  XRAY: [
    'phoneNumber',
    'licenseNumber',
    'licenseRegistryNumber',
    'model',
    'licenseDate',
    'licenseExpiryDate',
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
    'hazardousFacilityId',
    'oldRegistryNumber',
    'partialCheckDate',
    'fullCheckDate',
  ],
  HF: [
    'upperOrganization',
    'name',
    'hfTypeId',
    'spheres',
    'regionId',
    'districtId',
    'address',
    'location',
    'extraArea',
    'hazardousSubstance',
    'registryNumber',
    'description',
    'sign',
    'reasons',
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
  LIFT: [
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
}

const AppealMainInfo: FC<Props> = ({ type, data, address, isRegister = false }) => {
  const { t } = useTranslation()

  const serviceName =
    Object.values(MAIN_APPLICATION_BY_CATEGORY)
      .flat()
      .find((i) => i.id === data?.stateService)?.title ||
    APPLICATIONS_DATA.find((i) => i.type === data?.stateService)?.title ||
    (stateService as any)[data?.stateService]

  const USAGE_TYPE_MAP: Record<string, string> = {
    [IrsUsageType.USAGE]: 'Ishlatish (foydalanish) uchun',
    [IrsUsageType.DISPOSAL]: 'Ko‘mish uchun',
    [IrsUsageType.EXPORT]: 'Chet-elga olib chiqish uchun',
    [IrsUsageType.STORAGE]: 'Vaqtinchalik saqlash uchun',
  }

  const RISK_LEVEL_MAP: Record<string, string> = {
    I: 'I daraja',
    II: 'II daraja',
    III: 'III daraja',
    IV: 'IV daraja',
  }

  const usageTypeName = USAGE_TYPE_MAP[data?.usageType]

  const allowedFields = ALLOWED_FIELDS[type] || []

  const isAllowed = (field: string) => allowedFields.includes(field)

  const renderRow = (labelKey: string, value: any, isDate = false) => {
    if (!isAllowed(labelKey)) return null

    const finalValue = isDate ? getDate(value) : value

    return (
      <DetailRow
        key={labelKey}
        title={t(`labels.${type}.${labelKey}`)}
        value={finalValue || <span className="font-medium text-red-500">Mavjud emas</span>}
      />
    )
  }

  return (
    <div className="flex flex-col py-1">
      {/* Umumiy ma'lumotlar */}
      {/*{renderRow('phoneNumber', data?.phoneNumber)}*/}

      {/* XICHO (HF) maydonlari */}
      {renderRow('upperOrganization', data?.upperOrganization)}
      {renderRow('name', data?.name)}
      {renderRow('hfTypeId', data?.hfTypeName)}
      {isAllowed('spheres') &&
        renderRow('spheres', data?.spheres?.map((item: string) => t('application.' + item)).join(', '))}
      {renderRow('extraArea', data?.extraArea)}
      {renderRow('hazardousSubstance', data?.hazardousSubstance)}
      {renderRow('sign', data?.sign)}
      {renderRow('reasons', data?.reasons)}

      {/* Qurilmalar uchun umumiy maydonlar */}
      {renderRow('hazardousFacilityId', data?.hazardousFacilityName)}
      {renderRow('childEquipmentId', data?.childEquipmentName)}
      {renderRow('factoryNumber', data?.factoryNumber)}
      {renderRow('factory', data?.factory)}
      {renderRow('model', data?.model)}
      {renderRow('manufacturedAt', data?.manufacturedAt, true)}
      {renderRow('partialCheckDate', data?.partialCheckDate, true)}
      {renderRow('fullCheckDate', data?.fullCheckDate, true)}
      {renderRow('servicePeriod', data?.servicePeriod, true)}

      {/* Rentgen (XRAY) maydonlari */}
      {renderRow('licenseNumber', data?.licenseNumber)}
      {renderRow('licenseRegistryNumber', data?.licenseRegistryNumber)}
      {renderRow('licenseDate', data?.licenseDate, true)}
      {renderRow('licenseExpiryDate', data?.licenseExpiryDate, true)}
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
      {renderRow('acceptedAt', data?.acceptedAt, true)}
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
      {renderRow('nonDestructiveCheckDate', data?.nonDestructiveCheckDate, true)}

      {/* Attraksion uchun maxsus */}
      {renderRow('attractionName', data?.attractionName)}
      {renderRow('childEquipmentSortId', data?.childEquipmentSortName || data?.childEquipmentSortId)}
      {renderRow('riskLevel', RISK_LEVEL_MAP[data?.riskLevel] || data?.riskLevel)}

      {/* Umumiy manzil va joylashuv */}
      {renderRow('regionId', data?.regionName || data?.regionId)}
      {renderRow('districtId', data?.districtName || data?.districtId)}
      {renderRow('parkName', data?.parkName)}
      {renderRow('address', address)}
      {renderRow('location', data?.location)}

      {/* Umumiy meta ma'lumotlar */}
      {renderRow('type', t(`equipment_types.${type}`) || type)}
      {isRegister ? renderRow('registryNumber', data?.registryNumber) : null}

      {/* Xodimlar */}
      {(data?.managerCount || data?.engineerCount || data?.workerCount) && (
        <>
          {isAllowed('managerCount') && renderRow('managerCount', data?.managerCount)}
          {isAllowed('engineerCount') && renderRow('engineerCount', data?.engineerCount)}
          {isAllowed('workerCount') && renderRow('workerCount', data?.workerCount)}
        </>
      )}
    </div>
  )
}

export default AppealMainInfo
