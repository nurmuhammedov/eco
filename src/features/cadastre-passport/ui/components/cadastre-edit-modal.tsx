import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Form } from '@/shared/components/ui/form'
import { Button } from '@/shared/components/ui/button'
import { CadastreDataFields, CadastreRegistryFields, cadastreDataSchema } from './cadastre-data-fields'
import { splitAddress } from '../../model/txyuz-options'
import { useForm } from 'react-hook-form'
import { zodFormResolver } from '@/shared/lib/zod-form-resolver'
import type { z } from 'zod'
import type { CadastreSection } from '../../model/types'

type CadastreDataInput = z.input<typeof cadastreDataSchema>
type CadastreDataValues = z.output<typeof cadastreDataSchema>
import { useEffect } from 'react'
import useUpdate from '@/shared/hooks/api/use-update'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'

interface CadastreEditModalProps {
  isOpen: boolean
  onClose: () => void
  cadastreId: string
  defaultValues?: CadastreSection | null
}

export const CadastreEditModal = ({ isOpen, onClose, cadastreId, defaultValues }: CadastreEditModalProps) => {
  const queryClient = useQueryClient()
  const { mutate: updateCadastreData, isPending } = useUpdate<CadastreDataValues>(
    '/cadastre-passports',
    `${cadastreId}/preparer-cadastre-data`
  )

  const form = useForm<CadastreDataInput, unknown, CadastreDataValues>({
    resolver: zodFormResolver<CadastreDataInput, CadastreDataValues>(cadastreDataSchema),
  })

  useEffect(() => {
    if (defaultValues && isOpen) {
      const formattedValues: Record<string, unknown> = { ...defaultValues }

      // The record keeps dates as 'yyyy-MM-dd'; the picker works on Date.
      for (const key of [
        'cadastreRegistrationDate',
        'exploitationDate',
        'stateRegistryCertDate',
        'licenseDate',
      ] as const) {
        const value = defaultValues[key]
        if (value) formattedValues[key] = new Date(value)
      }

      // The address is one string on the record and three fields on the form.
      Object.assign(formattedValues, splitAddress(String(defaultValues.address ?? '')))

      // Coordinates come back as numbers; the masked inputs work on text.
      for (const axis of ['latitude', 'longitude'] as const) {
        const value = defaultValues[axis]
        formattedValues[axis] = value === null || value === undefined ? '' : String(value)
      }

      // The record is this form's own earlier output, keyed the same way
      form.reset(formattedValues as CadastreDataInput)
    }
  }, [defaultValues, isOpen, form])

  const onSubmit = (data: CadastreDataValues) => {
    updateCadastreData(data, {
      onSuccess: () => {
        toast.success('Ma’lumotlar muvaffaqiyatli saqlandi')
        void invalidateEndpoint(queryClient, '/cadastre-passports')
        onClose()
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>TXYUZ kadastr pasportining atributiv ma’lumotlarini tahrirlash</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="cadastre-edit-form" onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-6">
            <CadastreDataFields prefix="" />
            <div>
              <h6 className="mb-4 text-sm font-semibold text-gray-700">
                TXYUZ kadastr pasporti davlat reyestridan o‘tkazilganligi to‘g‘risida ma’lumotlar
              </h6>
              <CadastreRegistryFields prefix="" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Bekor qilish
              </Button>
              <Button type="submit" loading={isPending}>
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
