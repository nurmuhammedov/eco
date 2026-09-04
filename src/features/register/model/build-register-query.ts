import { RegisterActiveTab } from '@/widgets/register/types'

export interface BuildRegisterQueryInput {
  tab: string
  paramsObject: Record<string, any>
  isArchive?: boolean
  defaultRegionId: string
  hfId?: string
  radiationProfileId?: string
}

export interface RegisterQuery {
  endpoint: string
  params: Record<string, any>
}

const normalizeRegionId = (regionId: string) => (regionId === 'ALL' ? '' : regionId)

/**
 * Arriving from the deregistration report, the two report params define the set
 * on their own, so the tab's own change filters are left out. changed=true is
 * what resolves the pending change onto the row, which the request type column
 * reads.
 *
 * The active flag is the registry/archive divide and follows nothing but the
 * section it is read in - true under Reyestrlar, false under Arxiv - whatever
 * stage the report column asked for.
 */
interface ReportChangeFilters {
  reportChangeBelongType: string
  reportChangeStatus: string
  changed: true
  active: boolean
}

function readReportChangeFilters(paramsObject: Record<string, any>, isArchive?: boolean): ReportChangeFilters | null {
  const belongType = paramsObject.reportChangeBelongType
  if (!belongType) return null

  return {
    reportChangeBelongType: String(belongType),
    reportChangeStatus: String(paramsObject.reportChangeStatus || 'ALL'),
    changed: true,
    active: !isArchive,
  }
}

function buildHfQuery({ paramsObject, isArchive, defaultRegionId }: BuildRegisterQueryInput): RegisterQuery {
  const {
    mode = '',
    registryNumber = '',
    legalTin = '',
    legalName = '',
    legalAddress = '',
    name = '',
    active = isArchive ? 'false' : 'true',
    address = '',
    regionId = defaultRegionId,
    districtId = '',
    hfTypeId = '',
    categoryId = '',
    startDate = '',
    endDate = '',
    status = 'ALL',
  } = paramsObject

  const currentActive = String(active)
  const currentStatus = String(status)
  const report = readReportChangeFilters(paramsObject, isArchive)

  if (report) {
    return {
      endpoint: '/hf',
      params: {
        regionId: normalizeRegionId(regionId),
        districtId,
        active: report.active,
        changed: report.changed,
        reportChangeBelongType: report.reportChangeBelongType,
        reportChangeStatus: report.reportChangeStatus,
      },
    }
  }

  return {
    endpoint: '/hf',
    params: {
      mode,
      registryNumber,
      legalTin,
      legalName,
      legalAddress,
      name,
      address,
      status:
        currentActive === 'CHANGED'
          ? ''
          : currentActive === 'INVALID'
            ? 'INVALID'
            : currentActive === 'VALID'
              ? 'VALID'
              : currentStatus === 'ALL'
                ? ''
                : currentStatus,
      active:
        currentActive === 'INVALID' || currentActive === 'VALID' ? true : isArchive ? false : currentActive !== 'false',
      changed: currentActive === 'CHANGED' ? true : '',
      changeStatus: currentActive === 'CHANGED' && currentStatus !== 'ALL' ? currentStatus : '',
      regionId: normalizeRegionId(regionId),
      districtId,
      hfTypeId,
      categoryId,
      startDate,
      endDate,
    },
  }
}

function buildEquipmentsQuery({
  paramsObject,
  isArchive,
  defaultRegionId,
  hfId,
}: BuildRegisterQueryInput): RegisterQuery {
  const {
    status = isArchive ? 'INACTIVE' : 'ACTIVE',
    type = 'ALL',
    mode = '',
    regionId = defaultRegionId,
    districtId = '',
    registryNumber = '',
    childEquipmentId = '',
    ownerName = '',
    ownerIdentity = '',
    hfName = '',
    parkId = '',
    address = '',
    startDate = '',
    endDate = '',
    factoryNumber = '',
    changeStatus = 'ALL',
    hfId: searchHfId = '',
    activityType = '',
    tin = '',
    name = '',
    registerNumber = '',
    numberPlate = '',
    model = '',
    createdBy = '',
  } = paramsObject

  const currentStatus = String(status)

  if (type === 'TANKERS') {
    const isPin = String(tin).length === 14
    return {
      endpoint: '/tankers',
      params: {
        activityType: activityType && activityType !== 'ALL' ? activityType : undefined,
        status: currentStatus !== 'ALL' ? currentStatus : '',
        name,
        tin: tin && !isPin ? tin : undefined,
        pin: tin && isPin ? tin : undefined,
        registerNumber,
        numberPlate,
        model,
        createdBy: createdBy || undefined,
        regionId: normalizeRegionId(regionId),
      },
    }
  }

  const report = readReportChangeFilters(paramsObject, isArchive)

  if (report) {
    return {
      endpoint: '/equipments',
      params: {
        regionId: normalizeRegionId(regionId),
        districtId,
        active: report.active,
        changed: report.changed,
        reportChangeBelongType: report.reportChangeBelongType,
        reportChangeStatus: report.reportChangeStatus,
      },
    }
  }

  const isAutoCrane = type === 'AUTO_CRANE'
  const equipmentType = isAutoCrane ? 'CRANE' : type

  return {
    endpoint: '/equipments',
    params: {
      type: equipmentType !== 'ALL' ? equipmentType : '',
      childEquipmentId: isAutoCrane ? '31' : childEquipmentId,
      mode,
      regionId: normalizeRegionId(regionId),
      districtId,
      registryNumber,
      ownerName,
      ownerIdentity,
      hfName,
      hfId: hfId || searchHfId,
      parkId,
      address,
      factoryNumber,
      startDate,
      endDate,
      status: ['VALID', 'INVALID', 'EXPIRED', 'NO_DATE'].includes(currentStatus) ? currentStatus : '',
      active: isArchive
        ? false
        : currentStatus === 'ACTIVE'
          ? true
          : currentStatus === 'INACTIVE'
            ? false
            : currentStatus === 'CHANGED'
              ? 'true'
              : true,
      changed: isArchive ? '' : currentStatus === 'CHANGED' ? true : '',
      changeStatus: currentStatus === 'CHANGED' && changeStatus !== 'ALL' ? changeStatus : '',
    },
  }
}

function buildIrsQuery({
  paramsObject,
  isArchive,
  defaultRegionId,
  radiationProfileId,
}: BuildRegisterQueryInput): RegisterQuery {
  const {
    mode = '',
    regionId = defaultRegionId,
    districtId = '',
    registryNumber = '',
    legalName = '',
    legalAddress = '',
    legalTin = '',
    address = '',
    directorName = '',
    category = '',
    activity = '',
    sphere = '',
    factoryNumber = '',
    symbol = '',
    usageType = '',
    startDate = '',
    endDate = '',
    valid = isArchive ? 'false' : 'true',
    changeStatus = 'ALL',
  } = paramsObject

  const currentValid = String(valid)
  const isOrganizations = currentValid === 'ORGANIZATIONS' || currentValid === 'CHANGED_ORGANIZATIONS'

  if (isOrganizations) {
    return {
      endpoint: '/radiation-profiles',
      params: {
        type: 'IRS',
        legalName,
        legalTin,
        address: legalAddress || address,
        directorName,
        regionId: normalizeRegionId(regionId),
        districtId,
        changed: currentValid === 'CHANGED_ORGANIZATIONS' ? true : '',
        changeStatus: currentValid === 'CHANGED_ORGANIZATIONS' && changeStatus !== 'ALL' ? changeStatus : '',
      },
    }
  }

  const report = readReportChangeFilters(paramsObject, isArchive)

  if (report) {
    return {
      endpoint: '/irs',
      params: {
        regionId: normalizeRegionId(regionId),
        districtId,
        valid: report.active,
        changed: report.changed,
        reportChangeBelongType: report.reportChangeBelongType,
        reportChangeStatus: report.reportChangeStatus,
      },
    }
  }

  return {
    endpoint: '/irs',
    params: {
      mode,
      regionId: normalizeRegionId(regionId),
      districtId,
      registryNumber,
      legalName,
      legalAddress,
      legalTin,
      address,
      category,
      activity,
      sphere,
      factoryNumber,
      symbol,
      usageType,
      startDate,
      endDate,
      valid: currentValid === 'CHANGED' ? true : isArchive ? false : currentValid !== 'false',
      changed: currentValid === 'CHANGED' ? true : '',
      changeStatus: currentValid === 'CHANGED' && changeStatus !== 'ALL' ? changeStatus : '',
      radiationProfileId,
    },
  }
}

function buildXrayQuery({
  paramsObject,
  isArchive,
  defaultRegionId,
  radiationProfileId,
}: BuildRegisterQueryInput): RegisterQuery {
  const {
    mode = '',
    regionId = defaultRegionId,
    districtId = '',
    startDate = '',
    endDate = '',
    status = isArchive ? 'INACTIVE' : 'ACTIVE',
    changeStatus = 'ALL',
    registryNumber = '',
    licenseRegistryNumber = '',
    legalName = '',
    legalTin = '',
    address = '',
    directorName = '',
  } = paramsObject

  const currentStatus = String(status)
  const isOrganizations = currentStatus === 'ORGANIZATIONS' || currentStatus === 'CHANGED_ORGANIZATIONS'

  if (isOrganizations) {
    return {
      endpoint: '/radiation-profiles',
      params: {
        type: 'XRAY',
        legalName,
        legalTin,
        address,
        directorName,
        regionId: normalizeRegionId(regionId),
        districtId,
        changed: currentStatus === 'CHANGED_ORGANIZATIONS' ? true : '',
        changeStatus: currentStatus === 'CHANGED_ORGANIZATIONS' && changeStatus !== 'ALL' ? changeStatus : '',
      },
    }
  }

  const report = readReportChangeFilters(paramsObject, isArchive)

  if (report) {
    return {
      endpoint: '/xrays',
      params: {
        regionId: normalizeRegionId(regionId),
        districtId,
        active: report.active,
        changed: report.changed,
        reportChangeBelongType: report.reportChangeBelongType,
        reportChangeStatus: report.reportChangeStatus,
      },
    }
  }

  return {
    endpoint: '/xrays',
    params: {
      mode,
      regionId: normalizeRegionId(regionId),
      districtId,
      startDate,
      endDate,
      registryNumber,
      licenseRegistryNumber,
      legalName,
      legalTin,
      address,
      active: isArchive ? false : currentStatus !== 'INACTIVE',
      changed: currentStatus === 'CHANGED' ? true : '',
      changeStatus: currentStatus === 'CHANGED' && changeStatus !== 'ALL' ? changeStatus : '',
      status: currentStatus === 'EXPIRED' || currentStatus === 'NO_DATE' ? currentStatus : '',
      radiationProfileId,
    },
  }
}

export function buildRegisterQuery(input: BuildRegisterQueryInput): RegisterQuery {
  switch (String(input.tab)) {
    case String(RegisterActiveTab.EQUIPMENTS):
      return buildEquipmentsQuery(input)
    case String(RegisterActiveTab.IRS):
      return buildIrsQuery(input)
    case String(RegisterActiveTab.XRAY):
      return buildXrayQuery(input)
    default:
      return buildHfQuery(input)
  }
}

const EXPORTABLE_TABS: string[] = [RegisterActiveTab.HF, RegisterActiveTab.EQUIPMENTS, RegisterActiveTab.IRS]

function isExportableSubTab({ tab, paramsObject, isArchive }: BuildRegisterQueryInput) {
  switch (String(tab)) {
    case String(RegisterActiveTab.HF): {
      const active = String(paramsObject.active ?? (isArchive ? 'false' : 'true'))
      return active !== 'CHANGED'
    }
    case String(RegisterActiveTab.EQUIPMENTS): {
      const status = String(paramsObject.status ?? (isArchive ? 'INACTIVE' : 'ACTIVE'))
      const type = String(paramsObject.type ?? 'ALL')
      return status !== 'CHANGED' && type !== 'ALL' && type !== 'TANKERS'
    }
    case String(RegisterActiveTab.IRS): {
      const valid = String(paramsObject.valid ?? (isArchive ? 'false' : 'true'))
      return !['CHANGED', 'ORGANIZATIONS', 'CHANGED_ORGANIZATIONS'].includes(valid)
    }
    default:
      return false
  }
}

export function buildRegisterExportQuery(input: BuildRegisterQueryInput): RegisterQuery | null {
  if (!EXPORTABLE_TABS.includes(String(input.tab)) || !isExportableSubTab(input)) return null

  return buildRegisterQuery(input)
}
