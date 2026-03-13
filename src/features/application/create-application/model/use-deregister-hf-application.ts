import { DeRegisterHFSchema, DeRegisterHFDTO } from '@/entities/create-application'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export const useDeRegisterHFApplication = () => {
  const form = useForm<DeRegisterHFDTO>({
    resolver: zodResolver(DeRegisterHFSchema),
    defaultValues: {
      phoneNumber: '',
      registryNumber: '',
      // sign: '',
      reasons: '',
      justifiedDocumentPath: undefined,
      handoverActPath: undefined,
    },
    mode: 'onChange',
  })

  return {
    form,
  }
}
