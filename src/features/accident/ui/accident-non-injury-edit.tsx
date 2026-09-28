import { useEffect } from 'react'
import { parseISO } from 'date-fns'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { zodFormResolver } from '@/shared/lib/zod-form-resolver'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Button } from '@/shared/components/ui/button'
import DateTimePicker from '@/shared/components/ui/datetimepicker'

import { GoBack } from '@/shared/components/common'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/model/file-types'
import { DetailCardAccordion, DetailPageSkeleton } from '@/shared/components/common/detail-card'

import useDetail from '@/shared/hooks/api/use-detail'
import useUpdate from '@/shared/hooks/api/use-update'
import useData from '@/shared/hooks/api/use-data'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info'
import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info'
import {
  type AccidentDetail,
  type AccidentNonInjuryFormValues,
  type AccidentNonInjuryPayload,
  accidentNonInjuryEditSchema,
  AccidentProcessStatus,
} from '../model/types'
import type { HfDetail } from '@/entities/registry'

export const AccidentNonInjuryEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { detail: accident, isLoading } = useDetail<AccidentDetail>('/accidents', id, !!id)
  const updateMutation = useUpdate<AccidentNonInjuryPayload>('/accidents/non-injury', id)

  const { data: hfData } = useData<HfDetail>(`/hf/${accident?.hfId}`, !!accident?.hfId)

  const isCompleted = accident?.status === AccidentProcessStatus.COMPLETED
  const isFieldsDisabled = accident?.status === AccidentProcessStatus.NEW

  const form = useForm<AccidentNonInjuryFormValues, unknown, AccidentNonInjuryPayload>({
    resolver: zodFormResolver<AccidentNonInjuryFormValues, AccidentNonInjuryPayload>(accidentNonInjuryEditSchema),
    defaultValues: {
      hfId: '',
      shortDetail: '',
      economicLoss: '',
      guiltyEmployees: '',
      preventions: '',
      executions: '',
      specialActPath: '',
      commissionOrderPath: '',
      othersPath: '',
    },
  })

  useEffect(() => {
    if (accident) {
      if (isCompleted) {
        toast.warning('Bu avariya allaqachon yakunlangan va uni tahrirlab bo‘lmaydi.')
        navigate(`/accidents/${id}`)
        return
      }

      form.reset({
        hfId: accident.hfId ?? '',
        dateTime: accident.dateTime ? parseISO(accident.dateTime) : undefined,
        shortDetail: accident.shortDetail || '',
        economicLoss: accident.economicLoss?.toString() || '',
        stoppedFrom: accident.stoppedFrom ? parseISO(accident.stoppedFrom) : undefined,
        stoppedTo: accident.stoppedTo ? parseISO(accident.stoppedTo) : undefined,
        guiltyEmployees: accident.guiltyEmployees || '',
        preventions: accident.preventions || '',
        executions: accident.executions || '',
        specialActPath: accident.specialActPath,
        commissionOrderPath: accident.commissionOrderPath,
        othersPath: accident.othersPath,
      })
    }
  }, [accident, form, isCompleted, navigate, id])

  // The backend moves the status on by itself once the files are in
  const onSubmit = (payload: AccidentNonInjuryPayload) =>
    updateMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Avariya muvaffaqiyatli saqlandi')
        navigate(-1)
      },
    })

  if (isLoading) return <DetailPageSkeleton sections={3} />

  if (!accident) {
    return (
      <Card className="mt-4">
        <CardContent>
          <p className="p-4 text-center">Ma’lumotlar topilmadi</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto space-y-4 pb-10">
      <div className="flex items-center justify-between">
        <GoBack title="Avariya ma’lumotlarini tahrirlash" />
      </div>

      <DetailCardAccordion defaultValue={['form_info']}>
        <DetailCardAccordion.Item value="legal_info" title="Tashkilot to‘g‘risida ma’lumot">
          {accident.legalTin && <LegalApplicantInfo tinNumber={accident.legalTin.toString()} />}
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="object_info" title="XICHO to‘g‘risida ma’lumot">
          <AppealMainInfo data={hfData} type="HF" address={hfData?.address} />
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="form_info" title="Tahrirlash">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="dateTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Avariya yuz bergan vaqt va sana</FormLabel>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Sana va vaqtni tanlang"
                        disabled={isFieldsDisabled}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDetail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Avariyaning qisqacha tavsifi</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isFieldsDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="economicLoss"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avariyadan ko‘rilgan iqtisodiy zarar (so‘m)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" value={field.value || ''} disabled={isFieldsDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stoppedFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Obyektdan foydalanish to‘xtatilgan vaqt</FormLabel>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Vaqtni tanlang"
                        disabled={isFieldsDisabled}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stoppedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Obyektdan foydalanish qaytadan boshlangan vaqt</FormLabel>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Vaqtni tanlang"
                        disabled={isFieldsDisabled}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="guiltyEmployees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Avariyaning yuz berishida aybdor bo‘lgan xodimlar va ularga nisbatan qo‘llanilgan intizomiy jazo
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} value={field.value || ''} disabled={isFieldsDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="preventions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Komissiya xulosasiga asosan yuz bergan avariya oqibatlarini bartaraf etish bo‘yicha ko‘rilgan
                        chora-tadbirlar
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={5} value={field.value || ''} disabled={isFieldsDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="executions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chora-tadbirlar rejasining bajarilishi to‘g‘risida ma’lumotlar</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={5} value={field.value || ''} disabled={isFieldsDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Ilovalar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="specialActPath"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maxsus tekshirish dalolatnomasi</FormLabel>
                          <InputFile
                            form={form}
                            name={field.name}
                            uploadEndpoint="/attachments/accidents"
                            accept={[FileTypes.PDF, FileTypes.IMAGE]}
                            buttonText="Fayl yuklash"
                            disabled={isFieldsDisabled}
                            showPreview
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="commissionOrderPath"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Buyruq</FormLabel>
                          <InputFile
                            form={form}
                            name={field.name}
                            uploadEndpoint="/attachments/accidents"
                            accept={[FileTypes.PDF, FileTypes.IMAGE]}
                            buttonText="Fayl yuklash"
                            disabled={isFieldsDisabled}
                            showPreview
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="othersPath"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Avariyaga aloqador boshqa hujjatlar to‘plami</FormLabel>
                          <InputFile
                            form={form}
                            name={field.name}
                            uploadEndpoint="/attachments/accidents"
                            accept={[FileTypes.PDF, FileTypes.IMAGE]}
                            buttonText="Fayl yuklash"
                            disabled={isFieldsDisabled}
                            showPreview
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-start">
                <Button type="submit" loading={updateMutation.isPending} disabled={isFieldsDisabled}>
                  Saqlash
                </Button>
              </div>
            </form>
          </Form>
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  )
}
