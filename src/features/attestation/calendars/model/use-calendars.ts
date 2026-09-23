import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { CalendarPayload, CreateExamPayload } from '@/entities/attestation/model/types'
import { invalidateAttestation } from '@/entities/attestation/lib/invalidate'
import { calendarsAPI } from '../api/calendars.api'

const useExamMutation = <TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
  successMessage: string
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      toast.success(successMessage)
      invalidateAttestation(queryClient)
    },
  })
}

export const useCreateExam = () =>
  useExamMutation<CreateExamPayload>((data) => calendarsAPI.create(data), 'Imtihon belgilandi')

export const useUpdateExam = () =>
  useExamMutation<{ id: string; data: CalendarPayload }>(
    ({ id, data }) => calendarsAPI.update(id, data),
    'Imtihon vaqti yangilandi'
  )

export const useDeleteExam = () =>
  useExamMutation<string>((id) => calendarsAPI.remove(id), 'Imtihon o‘chirildi, arizalar navbatga qaytdi')

export const useAttachApplications = () =>
  useExamMutation<{ id: string; applicationIds: string[] }>(
    ({ id, applicationIds }) => calendarsAPI.attach(id, applicationIds),
    'Arizalar imtihonga qo‘shildi'
  )

export const useDetachApplication = () =>
  useExamMutation<{ id: string; applicationId: string }>(
    ({ id, applicationId }) => calendarsAPI.detach(id, applicationId),
    'Ariza navbatga qaytarildi'
  )
