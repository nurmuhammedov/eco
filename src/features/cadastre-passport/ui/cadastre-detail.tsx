import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCadastreMock } from '../model/use-cadastre-mock'
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
import { format } from 'date-fns'
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

type FvvFormValues = z.infer<typeof fvvSchema>
type SesFormValues = z.infer<typeof sesSchema>
type CommitteeFormValues = z.infer<typeof committeeSchema>

export default function CadastreDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data, getById, updateStatus, updateItem, addFvvApproval, addSesApproval, addCommitteeApproval } =
    useCadastreMock()

  const [item, setItem] = useState(getById(id || ''))

  // Re-fetch on global data change (from mock hook)
  useEffect(() => {
    setItem(getById(id || ''))
  }, [data, id, getById])

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

  if (!item) {
    return (
      <div className="text-muted-foreground p-8 text-center">
        Hujjat topilmadi. <Button onClick={() => navigate(-1)}>Orqaga</Button>
      </div>
    )
  }

  const isLegal = user?.role === UserRoles.LEGAL
  // Determine roles based on user tinOrPin for mock purposes
  const userTinOrPin = String(user?.tinOrPin || '')
  const isFVV = userTinOrPin === '303058580' && user?.role === UserRoles.LEGAL
  const isSES = userTinOrPin === '302358106' && user?.role === UserRoles.LEGAL
  const isCommittee = [UserRoles.MANAGER, UserRoles.CHAIRMAN, UserRoles.ADMIN].includes(user?.role as UserRoles)

  const handleSendToApproval = () => {
    updateStatus(item.id, 'IN_APPROVAL')
    toast.success('Kelishuvga yuborildi')
  }

  const handleFvvApprove = async (isReject = false) => {
    const isValid = await fvvForm.trigger()
    if (!isValid) return
    const fvvConclusion = fvvForm.watch('conclusion')
    if (isReject) {
      updateItem(item.id, {
        status: 'REJECTED',
        fvvName: 'O‘zbekiston Respublikasi Favqulodda vaziyatlar vazirligi',
        fvvStir: '303058580',
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
      fvvStir: '303058580',
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
        sesStir: '302358106',
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
      sesStir: '302358106',
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
          {(item.status === 'NEW' || item.status === 'REJECTED') && isLegal && (
            <Button onClick={handleSendToApproval}>Kelishishga yuborish</Button>
          )}
        </div>
      </div>

      <Accordion type="multiple" defaultValue={['txyz', 'fvv', 'ses', 'committee']}>
        <DetailCardAccordion.Item value="txyz" title="TXYZ Kadastr ma’lumotlari">
          <DetailRow title="Holati" value={<StatusBadge status={item.status} />} />
          <DetailRow
            title="Shakllantirish so‘rovi sanasi"
            value={format(new Date(item.createdAt), 'dd.MM.yyyy HH:mm')}
          />
          <DetailRow title="Ishlab chiqqan tashkilot nomi" value={item.creatorOrgName} />
          <DetailRow title="Ishlab chiqqan tashkilot STIR" value={item.creatorOrgStir} />
          <DetailRow title="So‘rov yuborilgan tashkilot nomi" value={item.targetOrgName} />
          <DetailRow title="So‘rov yuborilgan tashkilot STIR" value={item.targetOrgStir} />
          <DetailRow title="Titul fayli" value={<FileLink url={item.titleFile} title="Hujjatni ko‘rish" />} />
          <DetailRow title="Atribut fayli" value={<FileLink url={item.attributeFile} title="Hujjatni ko‘rish" />} />
          <DetailRow
            title="Kadastr passporti fayli"
            value={
              item.status === 'COMPLETED' ? (
                <FileLink url={item.passportFile} title="Hujjatni ko‘rish" />
              ) : (
                <span className="text-red-500">Mavjud emas</span>
              )
            }
          />
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="fvv" title="Favqulodda vaziyatlar vazirligi ma’lumotlari">
          <DetailRow
            title="Tashkilot nomi"
            value={item.fvvName || 'O‘zbekiston Respublikasi Favqulodda vaziyatlar vazirligi'}
          />
          <DetailRow title="Tashkilot STIR" value={item.fvvStir || '303058580'} />
          <DetailRow title="Tashkilot rahbari F.I.SH." value={item.fvvBoss || 'Ikramov Azizbek Israilovich'} />
          <DetailRow
            title="Tashkilot manzili"
            value={item.fvvAddress || 'Toshkent, 100084, Yunusobod tumani, Kichik xalqa yo‘li-4'}
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
            value={item.sesName || 'Sanitariya-epidemiologik osoyishtalik va jamoat salomatligi xizmati'}
          />
          <DetailRow title="Tashkilot STIR" value={item.sesStir || '302358106'} />
          <DetailRow title="Tashkilot rahbari F.I.SH." value={item.sesBoss || 'Yusupaliyev Baxodir Qahramonovich'} />
          <DetailRow
            title="Tashkilot manzili"
            value={item.sesAddress || 'Toshkent shahri, Chilonzor tumani, Bunyodkor ko‘chasi, 46.'}
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
    </div>
  )
}
