import { DeRegisterHF, DeRegisterHFDTO } from '@/entities/create-application'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export const useDeRegisterHFApplication = () => {
  const form = useForm<DeRegisterHFDTO>({
    resolver: zodResolver(DeRegisterHF),
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
  })

  return {
    form,
  }
}
