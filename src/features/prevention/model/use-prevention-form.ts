import { CreatePreventionDTO, schemas, useCreatePrevention, usePreventionTypes } from '@/entities/prevention'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

export function usePreventionForm() {
  const { tin } = useParams<{ tin: string }>()
  const navigate = useNavigate()
  const form = useForm<CreatePreventionDTO>({
    resolver: zodResolver(schemas.create),
    defaultValues: {
      tin: Number(tin),
      content: '',
    },
  })

  const { data: preventionTypesData, isLoading: isLoadingTypes } = usePreventionTypes()
  const { mutate: createPrevention, isPending } = useCreatePrevention()

  const preventionTypesOptions = useMemo(() => {
    return getSelectOptions(preventionTypesData?.data || [])
  }, [preventionTypesData])

  const onSubmit = (data: CreatePreventionDTO) => {
    createPrevention(data, {
      onSuccess: () => {
        navigate('/preventions?isPassed=true')
      },
    })
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
    isLoadingTypes,
    preventionTypesOptions,
  }
}
