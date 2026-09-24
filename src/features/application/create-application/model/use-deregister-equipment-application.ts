import {
  ApplicationCategory,
  APPLICATIONS_DATA,
  DeRegisterEquipmentDTO,
  DeRegisterEquipmentSchema,
  MainApplicationCategory,
} from '@/entities/create-application'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

export const useDeRegisterEquipmentApplication = () => {
  const form = useForm<DeRegisterEquipmentDTO>({
    resolver: zodResolver(DeRegisterEquipmentSchema),
    defaultValues: {
      phoneNumber: '',
      type: '',
      registryNumber: '',
      description: '',
      purchaseAgreementPath: undefined,
      orderSuspensionPath: undefined,
      laboratoryReportPath: undefined,
      additionalInfoPath: undefined,
    },
    mode: 'onChange',
  })

  const equipmentOptions = useMemo(() => {
    return APPLICATIONS_DATA?.filter(
      (i) => i.category === ApplicationCategory.EQUIPMENTS && i.parentId === MainApplicationCategory.REGISTER
    )
  }, [])

  return {
    form,
    equipmentOptions,
  }
}
