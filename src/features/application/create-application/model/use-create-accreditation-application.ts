import {
  ApplicationTypeEnum,
  RegisterAccreditationDTO,
  RegisterAccreditationSchema,
} from '@/entities/create-application'
import { useDistrictSelectQueries, useRegionSelectQueries } from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

export const ACCREDITATION_APPEAL_TITLES: Partial<Record<ApplicationTypeEnum, string>> = {
  [ApplicationTypeEnum.ACCREDIT_EXPERT]: 'Akkreditatsiyadan o‘tkazish',
  [ApplicationTypeEnum.RE_ACCREDIT_EXPERT]: 'Qayta akkreditatsiyadan o‘tkazish',
  [ApplicationTypeEnum.EXPEND_ACCREDITATION_SCOPE]: 'Akkreditatsiya sohasini kengaytirish va qisqartirish',
  [ApplicationTypeEnum.RE_ISSUE_ACCREDITATION_CERT]: 'Akkreditatsiya attestatini qayta rasmiylashtirish',
}

export const useCreateAccreditationApplication = (appealType: ApplicationTypeEnum) => {
  const form = useForm<RegisterAccreditationDTO>({
    resolver: zodResolver(RegisterAccreditationSchema),
    defaultValues: {
      appealType,
      activityRegionId: '',
      activityDistrictId: '',
      activityAddress: '',
      phoneNumber: '',
      email: '',
      accreditationScopePath: undefined,
      organizationCharterPath: undefined,
      complianceDeclarationPath: undefined,
      expertStaffListPath: undefined,
      equipmentAndConditionsPath: undefined,
      qmsCertificatePath: undefined,
      receiptPath: undefined,
    },
    mode: 'onChange',
  })

  const activityRegionId = form.watch('activityRegionId')

  const { data: regions } = useRegionSelectQueries()
  const { data: activityDistricts } = useDistrictSelectQueries(activityRegionId)

  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions])
  const activityDistrictOptions = useMemo(() => getSelectOptions(activityDistricts || []), [activityDistricts])

  return {
    form,
    regionOptions,
    activityDistrictOptions,
    title: ACCREDITATION_APPEAL_TITLES[appealType] ?? 'Akkreditatsiya arizasi',
  }
}
