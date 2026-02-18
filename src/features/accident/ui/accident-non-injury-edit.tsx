import { useEffect } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Button } from '@/shared/components/ui/button'
import DateTimePicker from '@/shared/components/ui/datetimepicker'

import { GoBack } from '@/shared/components/common'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'

import useDetail from '@/shared/hooks/api/useDetail'
import useUpdate from '@/shared/hooks/api/useUpdate'
import useData from '@/shared/hooks/api/useData'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info'
import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info'
import { AccidentNonInjury, AccidentNonInjuryFormValues, accidentNonInjuryEditSchema } from '../model/types'

export const AccidentNonInjuryEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { detail: accident, isLoading } = useDetail<AccidentNonInjury>('/accidents', id, !!id)
  const updateMutation = useUpdate<AccidentNonInjury, any, any>('/accidents/non-injury', id)

  const { data: hfoData } = useData<any>(`/hf/${accident?.hfId}`, !!accident?.hfId)

  const isCompleted = accident?.status === 'COMPLETED'

  const form = useForm<AccidentNonInjuryFormValues>({
    resolver: zodResolver(accidentNonInjuryEditSchema),
    defaultValues: {
      hfId: '',
      dateTime: undefined,
      shortDetail: '',
      economicLoss: '',
      stoppedFrom: undefined,
      stoppedTo: undefined,
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
        toast.warning('Bu avariya allaqachon yakunlangan va uni tahrirlab bolmaydi.')
        navigate(`/accidents/${id}`)
        return
      }

      form.reset({
        ...accident,
        dateTime: accident.dateTime ? new Date(accident.dateTime) : undefined,
        shortDetail: accident.shortDetail || '',
        economicLoss: accident.economicLoss?.toString() || '',
        stoppedFrom: accident.stoppedFrom ? new Date(accident.stoppedFrom) : undefined,
        stoppedTo: accident.stoppedTo ? new Date(accident.stoppedTo) : undefined,
        guiltyEmployees: accident.guiltyEmployees || '',
        preventions: accident.preventions || '',
        executions: accident.executions || '',
      } as AccidentNonInjuryFormValues)
    }
  }, [accident, form, isCompleted, navigate, id])

  const onSubmit = (data: any) => {
    const allFilesUploaded = !!data.specialActPath && !!data.commissionOrderPath && !!data.othersPath

    const currentStatus = accident?.status
    let newStatus = currentStatus

    if (allFilesUploaded) {
      newStatus = 'COMPLETED'
    } else if (currentStatus === 'NEW') {
      newStatus = 'IN_PROCESS'
    }

    const payload = {
      ...data,
      status: newStatus,
      dateTime: data.dateTime ? format(data.dateTime, "yyyy-MM-dd'T'HH:mm:ss") : null,
      stoppedFrom: data.stoppedFrom ? format(data.stoppedFrom, "yyyy-MM-dd'T'HH:mm:ss") : null,
      stoppedTo: data.stoppedTo ? format(data.stoppedTo, "yyyy-MM-dd'T'HH:mm:ss") : null,
    }

    updateMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Avariya muvaffaqiyatli saqlandi')
        navigate(`/accidents/${id}`)
      },
    })
  }

  if (isLoading) return <div>Yuklanmoqda...</div>

  if (!accident) {
    return (
      <Card className="mt-4">
        <CardContent>
          <p className="p-4 text-center">Maʼlumotlar topilmadi</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto space-y-4 pb-10">
      <GoBack title="Avariya ma'lumotlarini tahrirlash" />

      <DetailCardAccordion defaultValue={['form_info']}>
        <DetailCardAccordion.Item value="legal_info" title="Tashkilot to'g'risida ma'lumot">
          {accident.legalTin && <LegalApplicantInfo tinNumber={accident.legalTin} />}
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="object_info" title="XICHO to'g'risida ma'lumot">
          <AppealMainInfo data={hfoData} type="HF" address={hfoData?.address} />
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
                        <Input {...field} />
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
                      <FormLabel>Avariyadan koʻrilgan iqtisodiy zarar (soʻm)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" value={field.value || ''} />
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
                      <FormLabel>Obyektdan foydalanish toʻxtatilgan vaqt</FormLabel>
                      <DateTimePicker value={field.value} onChange={field.onChange} placeholder="Vaqtni tanlang" />
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
                      <DateTimePicker value={field.value} onChange={field.onChange} placeholder="Vaqtni tanlang" />
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
                        Avariyaning yuz berishida aybdor boʻlgan xodimlar va ularga nisbatan qoʻllanilgan intizomiy jazo
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} value={field.value || ''} />
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
                        Komissiya xulosasiga asosan yuz bergan avariya oqibatlarini bartaraf etish boʻyicha koʻrilgan
                        chora-tadbirlar
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={5} value={field.value || ''} />
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
                      <FormLabel>Chora-tadbirlar rejasining bajarilishi toʻgʻrisida maʼlumotlar</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={5} value={field.value || ''} />
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
                          <FormLabel>Avariyaga aloqador boshqa hujjatlar to'plami</FormLabel>
                          <InputFile
                            form={form}
                            name={field.name}
                            uploadEndpoint="/attachments/accidents"
                            accept={[FileTypes.PDF, FileTypes.IMAGE]}
                            buttonText="Fayl yuklash"
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
                <Button type="submit" loading={updateMutation.isPending}>
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
