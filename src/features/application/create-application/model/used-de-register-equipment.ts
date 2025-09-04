import { DeRegisterEquipment, DeRegisterEquipmentDTO } from '@/entities/create-application';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useDeRegisterEquipmentApplication = () => {
  const form = useForm<DeRegisterEquipmentDTO>({
    resolver: zodResolver(DeRegisterEquipment),
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
  });

  return {
    form,
  };
};
