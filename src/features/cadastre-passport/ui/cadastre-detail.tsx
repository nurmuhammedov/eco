import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import useData from '@/shared/hooks/api/useData'
import { ApplicationModal } from '@/features/application/create-application'
import { useEimzo } from '@/shared/hooks/use-eimzo'
import { Button } from '@/shared/components/ui/button'
import GoBack from '@/shared/components/common/go-back'
import { toast } from 'sonner'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'
import { Accordion } from '@/shared/components/ui/accordion'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import DetailRow from '@/shared/components/common/detail-row'
import { Textarea } from '@/shared/components/ui/textarea'
import FileLink from '@/shared/components/common/file-link'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form'
import { InputFile } from '@/shared/components/common/file-upload'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { StatusBadge } from './cadastre-list'

const fvvSchema = z.object({
  conclusion: z.string().min(1, 'Majburiy maydon!'),
  file: z.string().min(1, 'Majburiy maydon!'),
})
const sesSchema = z.object({
  conclusion: z.string().min(1, 'Majburiy maydon!'),
  file: z.string().min(1, 'Majburiy maydon!'),
})
const committeeSchema = z.object({
  conclusion: z.string().min(1, 'Majburiy maydon!'),
})

const actionSchema = z.object({
  conclusion: z.string().min(1, 'Majburiy maydon!'),
})

type FvvFormValues = z.infer<typeof fvvSchema>
type SesFormValues = z.infer<typeof sesSchema>
type CommitteeFormValues = z.infer<typeof committeeSchema>

export default function CadastreDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [actionModalOpen, setActionModalOpen] = useState(false)
  const [signAction, setSignAction] = useState<'APPROVED' | 'REJECTED'>('APPROVED')

  const actionForm = useForm<z.infer<typeof actionSchema>>({
    resolver: zodResolver(actionSchema),
    defaultValues: { conclusion: '' },
  })

  const handleOpenActionModal = (action: 'APPROVED' | 'REJECTED') => {
    setSignAction(action)
    actionForm.reset({ conclusion: '' })
    setActionModalOpen(true)
  }

  const onActionSubmit = (data: z.infer<typeof actionSchema>) => {
    handleCreateApplication({ conclusion: data.conclusion, signAction })
    setActionModalOpen(false)
  }

  const { data: item, isLoading } = useQuery<any>({
    queryKey: ['cadastre-passports', id],
    queryFn: async () => {
      const response = await apiClient.get<any>(`/cadastre-passports/${id}`)
      return response.data?.data || response.data
    },
    enabled: !!id,
  })

  const { data: preparerInfo } = useData<any>(`/users/legal/${item?.preparerTin}`, !!item?.preparerTin)
  const { data: customerInfo } = useData<any>(`/users/legal/${item?.customerTin}`, !!item?.customerTin)
  const { data: fvvInfo } = useData<any>('/users/legal/201862006')
  const { data: sesInfo } = useData<any>('/users/legal/200794614')

  const {
    error,
    isLoading: isEimzoLoading,
    documentUrl,
    isModalOpen,
    isPdfLoading,
    handleCloseModal,
    handleCreateApplication,
    submitApplicationMetaData,
  } = useEimzo({
    pdfEndpoint: `/cadastre-passports/${id}/preview-pdf`,
    pdfMethod: 'get',
    submitEndpoint: `/cadastre-passports/${id}/customer-sign`,
    successMessage: 'Kelishuvga muvaffaqiyatli yuborildi!',
    queryKey: 'cadastre-passports',
  })

  // const updateStatus = (id: string, status: string) => {}
  const updateItem = (id: string, payload: any) => {
    console.log(id, payload)
  }

  const addFvvApproval = (id: string, payload: any) => {
    console.log(id, payload)
  }
  const addSesApproval = (id: string, payload: any) => {
    console.log(id, payload)
  }
  const addCommitteeApproval = (id: string, payload: any) => {
    console.log(id, payload)
  }

  // Forms
  const fvvForm = useForm<FvvFormValues>({
    resolver: zodResolver(fvvSchema),
    defaultValues: { conclusion: '', file: '' },
  })
  const sesForm = useForm<SesFormValues>({
    resolver: zodResolver(sesSchema),
    defaultValues: { conclusion: '', file: '' },
  })
  const committeeForm = useForm<CommitteeFormValues>({
    resolver: zodResolver(committeeSchema),
    defaultValues: { conclusion: '' },
  })

  if (isLoading) {
    return <div className="text-muted-foreground p-8 text-center">Yuklanmoqda...</div>
  }

  if (!item) {
    return (
      <div className="text-muted-foreground p-8 text-center">
        Hujjat topilmadi. <Button onClick={() => navigate(-1)}>Orqaga</Button>
      </div>
    )
  }

  // const isLegal = user?.role === UserRoles.LEGAL
  const userTinOrPin = String(user?.tinOrPin || '')
  const isFVV = userTinOrPin === '201862006' && user?.role === UserRoles.LEGAL
  const isSES = userTinOrPin === '200794614' && user?.role === UserRoles.LEGAL
  const isCommittee = [UserRoles.MANAGER, UserRoles.CHAIRMAN, UserRoles.ADMIN].includes(user?.role as UserRoles)

  // const handleSendToApproval = () => {
  //   updateStatus(item.id, 'IN_APPROVAL')
  //   toast.success('Kelishuvga yuborildi')
  // }

  const handleFvvApprove = async (isReject = false) => {
    const isValid = await fvvForm.trigger()
    if (!isValid) return
    const fvvConclusion = fvvForm.watch('conclusion')
    if (isReject) {
      updateItem(item.id, {
        status: 'REJECTED',
        fvvName: 'O‘zbekiston Respublikasi Favqulodda vaziyatlar vazirligi',
        fvvStir: '201862006',
        fvvBoss: 'Ikramov Azizbek Israilovich',
        fvvAddress: 'Toshkent, 100084, Yunusobod tumani, Kichik xalqa yo‘li-4',
        fvvConclusion: fvvConclusion,
        fvvFile: fvvForm.watch('file'),
      })
      toast.error('Rad etildi')
      return
    }
    addFvvApproval(item.id, {
      fvvName: 'O‘zbekiston Respublikasi Favqulodda vaziyatlar vazirligi',
      fvvStir: '201862006',
      fvvBoss: 'Ikramov Azizbek Israilovich',
      fvvAddress: 'Toshkent, 100084, Yunusobod tumani, Kichik xalqa yo‘li-4',
      fvvConclusion: fvvConclusion || 'Tasdiqlandi',
      fvvFile: fvvForm.watch('file') || '/files/registry-files/2025/july/22/1753177653262.pdf',
    })
    toast.success('FVV tomonidan tasdiqlandi')
  }

  const handleSesApprove = async (isReject = false) => {
    const isValid = await sesForm.trigger()
    if (!isValid) return
    const sesConclusion = sesForm.watch('conclusion')
    if (isReject) {
      updateItem(item.id, {
        status: 'REJECTED',
        sesName: 'Sanitariya-epidemiologik osoyishtalik va jamoat salomatligi xizmati',
        sesStir: '200794614',
        sesBoss: 'Yusupaliyev Baxodir Qahramonovich',
        sesAddress: 'Toshkent shahri, Chilonzor tumani, Bunyodkor ko‘chasi, 46.',
        sesConclusion: sesConclusion,
        sesFile: sesForm.watch('file'),
      })
      toast.error('Rad etildi')
      return
    }
    addSesApproval(item.id, {
      sesName: 'Sanitariya-epidemiologik osoyishtalik va jamoat salomatligi xizmati',
      sesStir: '200794614',
      sesBoss: 'Yusupaliyev Baxodir Qahramonovich',
      sesAddress: 'Toshkent shahri, Chilonzor tumani, Bunyodkor ko‘chasi, 46.',
      sesConclusion: sesConclusion || 'Ijobiy xulosa',
      sesFile: sesForm.watch('file') || '/files/registry-files/2025/july/22/1753177653262.pdf',
    })
    toast.success('SES tomonidan tasdiqlandi')
  }

  const handleCommitteeApprove = async (isReject = false) => {
    const isValid = await committeeForm.trigger('conclusion')
    if (!isValid) return
    const committeeConclusion = committeeForm.watch('conclusion')
    if (isReject) {
      updateItem(item.id, {
        status: 'REJECTED',
        committeeBoss: user?.name || 'Qo‘mita raisi',
        committeeConclusion: committeeConclusion,
      })
      toast.error('Rad etildi')
      return
    }
    addCommitteeApproval(item.id, {
      committeeBoss: user?.name || 'Qo‘mita raisi',
      committeeConclusion: committeeConclusion || "Barcha hujjatlar to'g'ri. Tasdiqlandi.",
    })
    toast.success("Qo'mita tomonidan yakunlandi")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <GoBack title={`Hujjat tafsiloti ${item.registryNumber ? `(${item.registryNumber})` : ''}`} />
        <div className="flex gap-2">
          {item.status === 'NEW' && String(user?.tinOrPin) === String(item.customerTin) && (
            <>
              <Button variant="destructive" onClick={() => handleOpenActionModal('REJECTED')}>
                Rad etish
              </Button>
              <Button onClick={() => handleOpenActionModal('APPROVED')}>Tasdiqlash</Button>
            </>
          )}
        </div>
      </div>

      <Accordion type="multiple" defaultValue={['txyz', 'fvv', 'ses', 'committee']}>
        <DetailCardAccordion.Item value="txyz" title="TXYZ Kadastr ma’lumotlari">
          <DetailRow title="Holati" value={<StatusBadge status={item.status} />} />
          <DetailRow title="Ariza raqami" value={item.requestNumber || '-'} />
          <DetailRow title="Reyestr raqami" value={item.registryNumber || '-'} />
          <DetailRow title="Ishlab chiqqan tashkilot nomi" value={preparerInfo?.name || item.preparerName || '-'} />
          <DetailRow title="Ishlab chiqqan tashkilot STIR" value={item.preparerTin || '-'} />
          <DetailRow title="Tashkilot nomi" value={customerInfo?.name || item.customerName || '-'} />
          <DetailRow title="Tashkilot STIR" value={item.customerTin || '-'} />

          <DetailRow
            title="Titul fayli"
            value={
              item.titlePagePath ? (
                <FileLink url={item.titlePagePath} title="Hujjatni ko‘rish" />
              ) : (
                <span className="text-red-500">Mavjud emas</span>
              )
            }
          />
          <DetailRow
            title="Atribut fayli"
            value={
              item.detailFilePath ? (
                <FileLink url={item.detailFilePath} title="Hujjatni ko‘rish" />
              ) : (
                <span className="text-red-500">Mavjud emas</span>
              )
            }
          />
          <DetailRow
            title="Kadastr passporti fayli"
            value={
              item.passportFilePath ? (
                <FileLink url={item.passportFilePath} title="Hujjatni ko‘rish" />
              ) : (
                <span className="text-red-500">Mavjud emas</span>
              )
            }
          />
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="fvv" title="Favqulodda vaziyatlar vazirligi ma’lumotlari">
          <DetailRow
            title="Tashkilot nomi"
            value={fvvInfo?.name || item.fvvName || 'O‘zbekiston Respublikasi Favqulodda vaziyatlar vazirligi'}
          />
          <DetailRow title="Tashkilot STIR" value={fvvInfo?.identity || item.fvvStir || '201862006'} />
          <DetailRow
            title="Tashkilot rahbari F.I.SH."
            value={fvvInfo?.directorName || item.fvvBoss || 'Ikramov Azizbek Israilovich'}
          />
          <DetailRow
            title="Tashkilot manzili"
            value={fvvInfo?.address || item.fvvAddress || 'Toshkent, 100084, Yunusobod tumani, Kichik xalqa yo‘li-4'}
          />
          <DetailRow
            title="Tashkilot xulosasi"
            value={item.fvvConclusion || (item.fvvApproved ? '-' : <span className="text-red-500">Mavjud emas</span>)}
          />
          {item.fvvFile ? (
            <DetailRow title="Xulosa fayli" value={<FileLink url={item.fvvFile} title="Hujjatni ko‘rish" />} />
          ) : (
            <DetailRow title="Xulosa fayli" value={<span className="text-red-500">Mavjud emas</span>} />
          )}

          {!item.fvvApproved && item.status === 'IN_APPROVAL' && (isFVV || isCommittee) && (
            <div className="mt-4 space-y-4 border-t py-2 pt-4">
              <div className="space-y-2 rounded-md border p-4">
                <h4 className="mb-4 text-sm font-medium">FVV xulosasini kiritish</h4>
                <Form {...fvvForm}>
                  <div className="space-y-4">
                    <FormField
                      control={fvvForm.control}
                      name="conclusion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Xulosa matni</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Xulosa matni..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={fvvForm.control}
                      name="file"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Xulosa fayli</FormLabel>
                          <FormControl>
                            <InputFile
                              name={field.name as 'file'}
                              form={fvvForm}
                              uploadEndpoint="/attachments/accidents"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="destructive" onClick={() => handleFvvApprove(true)}>
                    Rad etish
                  </Button>
                  <Button onClick={() => handleFvvApprove(false)}>Tasdiqlash</Button>
                </div>
              </div>
            </div>
          )}
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="ses" title="Sanitariya-epidemiologik osoyishtalik xizmati ma’lumotlari">
          <DetailRow
            title="Tashkilot nomi"
            value={
              sesInfo?.name || item.sesName || 'Sanitariya-epidemiologik osoyishtalik va jamoat salomatligi xizmati'
            }
          />
          <DetailRow title="Tashkilot STIR" value={sesInfo?.identity || item.sesStir || '200794614'} />
          <DetailRow
            title="Tashkilot rahbari F.I.SH."
            value={sesInfo?.directorName || item.sesBoss || 'Yusupaliyev Baxodir Qahramonovich'}
          />
          <DetailRow
            title="Tashkilot manzili"
            value={sesInfo?.address || item.sesAddress || 'Toshkent shahri, Chilonzor tumani, Bunyodkor ko‘chasi, 46.'}
          />
          <DetailRow
            title="Tashkilot xulosasi"
            value={item.sesConclusion || (item.sesApproved ? '-' : <span className="text-red-500">Mavjud emas</span>)}
          />
          {item.sesFile ? (
            <DetailRow title="Xulosa fayli" value={<FileLink url={item.sesFile} title="Hujjatni ko‘rish" />} />
          ) : (
            <DetailRow title="Xulosa fayli" value={<span className="text-red-500">Mavjud emas</span>} />
          )}

          {!item.sesApproved && item.status === 'IN_APPROVAL' && (isSES || isCommittee) /* Mock bypass */ && (
            <div className="mt-4 space-y-4 border-t py-2 pt-4">
              <div className="space-y-2 rounded-md border p-4">
                <h4 className="mb-4 text-sm font-medium">SES xulosasini kiritish</h4>
                <Form {...sesForm}>
                  <div className="space-y-4">
                    <FormField
                      control={sesForm.control}
                      name="conclusion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Xulosa matni</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Xulosa matni..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={sesForm.control}
                      name="file"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Xulosa fayli</FormLabel>
                          <FormControl>
                            <InputFile
                              name={field.name as 'file'}
                              form={sesForm}
                              uploadEndpoint="/attachments/accidents"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="destructive" onClick={() => handleSesApprove(true)}>
                    Rad etish
                  </Button>
                  <Button onClick={() => handleSesApprove(false)}>Tasdiqlash</Button>
                </div>
              </div>
            </div>
          )}
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="committee" title="Qo‘mita ma’lumotlari">
          <DetailRow
            title="Ijrochi mas’ul F.I.SH."
            value={item.committeeApproved ? item.committeeBoss : <span className="text-red-500">Mavjud emas</span>}
          />
          <DetailRow
            title="Ijrochi mas’ul xulosasi"
            value={
              item.committeeApproved ? item.committeeConclusion : <span className="text-red-500">Mavjud emas</span>
            }
          />
          {!item.committeeApproved && (
            <div className="mt-4 space-y-4 border-t py-2 pt-4">
              {item.status === 'COMMITTEE' && isCommittee && (
                <div className="space-y-2 rounded-md border p-4">
                  <h4 className="mb-4 text-sm font-medium">Qo‘mita qarori (Yakunlash)</h4>
                  <Form {...committeeForm}>
                    <FormField
                      control={committeeForm.control}
                      name="conclusion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Yakuniy xulosa</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Yakuniy xulosa..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Form>
                  <div className="flex justify-end gap-2">
                    <Button variant="destructive" onClick={() => handleCommitteeApprove(true)}>
                      Rad etish
                    </Button>
                    <Button onClick={() => handleCommitteeApprove(false)}>Tasdiqlash (Yakunlash)</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DetailCardAccordion.Item>
      </Accordion>

      <ApplicationModal
        error={error}
        isOpen={isModalOpen}
        isLoading={isEimzoLoading}
        documentUrl={documentUrl!}
        onClose={handleCloseModal}
        isPdfLoading={isPdfLoading}
        submitApplicationMetaData={submitApplicationMetaData}
      />

      <Dialog open={actionModalOpen} onOpenChange={setActionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{signAction === 'APPROVED' ? 'Tasdiqlash' : 'Rad etish'}</DialogTitle>
          </DialogHeader>
          <Form {...actionForm}>
            <form onSubmit={actionForm.handleSubmit(onActionSubmit)} className="space-y-4">
              <FormField
                control={actionForm.control}
                name="conclusion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Xulosa</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Xulosani kiriting..." rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setActionModalOpen(false)}>
                  Bekor qilish
                </Button>
                <Button type="submit" variant={signAction === 'APPROVED' ? 'default' : 'destructive'}>
                  {signAction === 'APPROVED' ? 'Tasdiqlash' : 'Rad etish'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
