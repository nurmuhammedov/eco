import {
  ApplicationTypeEnum,
  RegisterAccreditationDTO,
  RegisterAccreditationSchema,
} from '@/entities/create-application'
import { useDistrictSelectQuery, useRegionSelectQuery } from '@/shared/api/dictionaries'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { type FormDraft, zodFormResolver } from '@/shared/lib/zod-form-resolver'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

export const ACCREDITATION_APPEAL_TITLES: Partial<Record<ApplicationTypeEnum, string>> = {
  [ApplicationTypeEnum.ACCREDIT_EXPERT]: 'Akkreditatsiyadan o‘tkazish',
  [ApplicationTypeEnum.RE_ACCREDIT_EXPERT]: 'Qayta akkreditatsiyadan o‘tkazish',
  [ApplicationTypeEnum.EXPEND_ACCREDITATION_SCOPE]: 'Akkreditatsiya sohasini kengaytirish va qisqartirish',
  [ApplicationTypeEnum.RE_ISSUE_ACCREDITATION_CERT]: 'Akkreditatsiya attestatini qayta rasmiylashtirish',
}

export const useCreateAccreditationApplication = (appealType: ApplicationTypeEnum) => {
  const form = useForm<FormDraft<typeof RegisterAccreditationSchema>, unknown, RegisterAccreditationDTO>({
    resolver: zodFormResolver<FormDraft<typeof RegisterAccreditationSchema>, RegisterAccreditationDTO>(
      RegisterAccreditationSchema
    ),
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

  const { data: regions } = useRegionSelectQuery()
  const { data: activityDistricts } = useDistrictSelectQuery(activityRegionId)

  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions])
  const activityDistrictOptions = useMemo(() => getSelectOptions(activityDistricts || []), [activityDistricts])

  return {
    form,
    regionOptions,
    activityDistrictOptions,
    title: ACCREDITATION_APPEAL_TITLES[appealType] ?? 'Akkreditatsiya arizasi',
  }
}
