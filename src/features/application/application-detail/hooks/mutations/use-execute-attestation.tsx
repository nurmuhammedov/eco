import { conductAttestation } from '@/entities/attestation/api/attestation.api';
import { QK_APPLICATIONS } from '@/shared/constants/query-keys';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

const conductAttestationSchema = z.object({
  dateOfAttestation: z.date({
    required_error: 'Attestatsiya sanasini tanlang',
  }),
  filePath: z.string().min(1, 'Bayonnoma faylini yuklang'),
  result: z.record(z.enum(['PASSED', 'FAILED']).default('PASSED'), {
    errorMap: () => ({ message: 'Barcha xodimlar uchun natijani belgilang' }),
  }),
});

type ConductAttestationForm = z.infer<typeof conductAttestationSchema>;

export const useExecuteAttestation = (appealId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const naviagte = useNavigate();

  const form = useForm<ConductAttestationForm>({
    resolver: zodResolver(conductAttestationSchema),
    defaultValues: {
      result: {},
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: conductAttestation,
    onSuccess: () => {
      toast.success(t('Muvaffaqiyatli saqlandi!'));
      naviagte('/attestations');
      queryClient.invalidateQueries({ queryKey: [QK_APPLICATIONS, appealId] });
    },
  });

  const onSubmit = (data: any) => {
    mutate({
      appealId,
      dateOfAttestation: format(data.dateOfAttestation, "yyyy-MM-dd'T'HH:mm"),
      filePath: data.filePath,
      result: data.result,
    });
  };

  return {
    form,
    onSubmit,
    isPending,
  };
};
