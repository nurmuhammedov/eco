import { DeRegisterHFO, DeRegisterHFOtDTO } from '@/entities/create-application';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useDeRegisterHfoApplication = () => {
  const form = useForm<DeRegisterHFOtDTO>({
    resolver: zodResolver(DeRegisterHFO),
    defaultValues: {
      phoneNumber: '',
      registryNumber: '',
      description: '',
      sign: '',
      reasons: '',
      justifiedDocumentPath: undefined,
      filePath: undefined,
      type: 'REPORT',
    },
    mode: 'onChange',
  });

  return {
    form,
  };
};
