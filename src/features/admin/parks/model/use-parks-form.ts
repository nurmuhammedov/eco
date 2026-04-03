import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Park, parkSchema, type ParkSchemaType, useCreatePark, useUpdatePark } from '@/entities/admin/park'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

interface UseParksFormProps {
  onSuccess: () => void
  initialData?: Park | null
}

export const useParksForm = ({ onSuccess, initialData }: UseParksFormProps) => {
  const { t } = useTranslation('common')
  const createPark = useCreatePark()
  const updatePark = useUpdatePark()

  const form = useForm<ParkSchemaType>({
    resolver: zodResolver(parkSchema),
    defaultValues: {
      name: '',
      regionId: 0,
      districtId: 0,
      address: '',
      location: '',
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        regionId: initialData.regionId,
        districtId: initialData.districtId,
        address: initialData.address,
        location: initialData.location,
      })
    } else {
      form.reset({
        name: '',
        regionId: 0,
        districtId: 0,
        address: '',
        location: '',
      })
    }
  }, [initialData, form])

  const onSubmit = async (values: ParkSchemaType) => {
    try {
      if (initialData) {
        await updatePark.mutateAsync({ ...values, id: initialData.id })
        toast.success(t('park_updated_successfully'))
      } else {
        await createPark.mutateAsync(values)
        toast.success(t('park_created_successfully'))
      }
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || t('something_went_wrong'))
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: createPark.isPending || updatePark.isPending,
  }
}
