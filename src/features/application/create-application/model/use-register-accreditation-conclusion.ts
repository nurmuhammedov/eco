import { AccreditationConclusionDtoSchema, AccreditationConclusionDTO } from '@/entities/create-application'
import { API_ENDPOINTS } from '@/shared/api'
import { useEIMZO } from '@/shared/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDistrictSelectQueries, useRegionSelectQueries } from '@/shared/api/dictionaries'
import { useMemo } from 'react'
import { getSelectOptions } from '@/shared/lib/get-select-options.tsx'
import { format } from 'date-fns'

export const useRegisterAccreditationConclusion = () => {
  const { t } = useTranslation('accreditation')
  const form = useForm<AccreditationConclusionDTO>({
    resolver: zodResolver(AccreditationConclusionDtoSchema),
    mode: 'onChange',
  })
  const regionId = form.watch('regionId')?.toString()

  const { data: regions } = useRegionSelectQueries()
  const { data: districts } = useDistrictSelectQueries(regionId)
  const regionOptions = useMemo(() => getSelectOptions(regions || []), [regions])
  const districtOptions = useMemo(() => getSelectOptions(districts || []), [districts])
  const {
    error,
    isLoading,
    documentUrl = '',
    isModalOpen,
    isPdfLoading,
    handleCloseModal,
    handleCreateApplication,
    submitApplicationMetaData,
  } = useEIMZO({
    pdfEndpoint: API_ENDPOINTS.APPEALS_ACCREDITATION_CONCLUSION_GENERATE_PDF,
    submitEndpoint: API_ENDPOINTS.APPEALS_ACCREDITATION_CONCLUSION,
    queryKey: 'accreditation-conclusion',
    successMessage: 'Muvaffaqiyatli saqlandi!!',
    onSuccessNavigateTo: '/accreditations',
  })

  const onSubmit = (data: AccreditationConclusionDTO) => {
    handleCreateApplication({
      ...data,
      regionId: Number(data.regionId),
      districtId: Number(data.districtId),
      monitoringLetterDate: format(data.monitoringLetterDate, 'yyyy-MM-dd'),
      submissionDate: format(data.submissionDate, 'yyyy-MM-dd'),
    })
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    isModalOpen,
    documentUrl,
    isPdfLoading,
    handleCloseModal,
    submitApplicationMetaData,
    error,
    regionOptions,
    districtOptions,
    t,
  }
}
