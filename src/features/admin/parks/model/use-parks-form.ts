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
      regionId: '',
      districtId: '',
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
        location: initialData.location || '',
      })
    } else {
      form.reset({
        name: '',
        regionId: '',
        districtId: '',
        address: '',
        location: '',
      })
    }
  }, [initialData, form])

  const onSubmit = (values: ParkSchemaType) => {
    const park = {
      ...values,
      regionId: Number(values.regionId),
      districtId: Number(values.districtId),
      location: values.location || null,
    }
    const done = (message: string) => () => {
      toast.success(message)
      form.reset()
      onSuccess()
    }

    if (initialData)
      updatePark.mutate({ ...park, id: initialData.id }, { onSuccess: done(t('park_updated_successfully')) })
    else createPark.mutate(park, { onSuccess: done(t('park_created_successfully')) })
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: createPark.isPending || updatePark.isPending,
  }
}
