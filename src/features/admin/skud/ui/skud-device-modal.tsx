import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Switch } from '@/shared/components/ui/switch'
import type { SkudDevice, SkudDirection, SkudRegion } from '../api/skud.api'
import { useCreateSkudDevice, useUpdateSkudDevice } from '../model/use-skud'
import { DIRECTION_LABELS } from './skud-labels'

interface Props {
  isOpen: boolean
  onClose: () => void
  regions: SkudRegion[]
  device?: SkudDevice | null
}

interface FormState {
  region_id: string
  direction: SkudDirection | ''
  name: string
  location: string
  is_active: boolean
}

const EMPTY: FormState = { region_id: '', direction: '', name: '', location: '', is_active: true }

export const SkudDeviceModal = ({ isOpen, onClose, regions, device }: Props) => {
  const isEditing = !!device
  const [form, setForm] = useState<FormState>(EMPTY)

  const createMutation = useCreateSkudDevice()
  const updateMutation = useUpdateSkudDevice()
  const isPending = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (!isOpen) return

    setForm(
      device
        ? {
            region_id: String(device.region_id),
            direction: device.direction,
            name: device.name ?? '',
            location: device.location ?? '',
            is_active: device.is_active,
          }
        : EMPTY
    )
  }, [isOpen, device])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  // The limit (Tashkent 2 + 2, other regions 1 + 1) is checked by the server;
  // here it only greys out a direction that is already full
  const region = regions.find((item) => String(item.id) === form.region_id)
  const isFull = (direction: SkudDirection) => {
    if (!region) return false
    const taken = isEditing && device?.region_id === region.id && device.direction === direction ? 1 : 0
    return region.devices[direction].free + taken <= 0
  }

  const isValid = !!form.region_id && !!form.direction && (!isEditing || form.name.trim() !== '')

  const handleSubmit = () => {
    if (!isValid || !form.direction) return

    const data = {
      region_id: Number(form.region_id),
      direction: form.direction,
      name: form.name.trim() || null,
      location: form.location.trim() || null,
      is_active: form.is_active,
    }

    if (isEditing && device) {
      updateMutation.mutate({ id: device.id, data }, { onSuccess: onClose })
    } else {
      createMutation.mutate(data, { onSuccess: onClose })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Qurilmani tahrirlash' : 'Qurilma qo‘shish'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Hudud *</Label>
            <Select value={form.region_id} onValueChange={(value) => set('region_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Hududni tanlang" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Yo‘nalishi *</Label>
            <Select value={form.direction} onValueChange={(value) => set('direction', value as SkudDirection)}>
              <SelectTrigger>
                <SelectValue placeholder="Kirish yoki chiqish" />
              </SelectTrigger>
              <SelectContent>
                {(['in', 'out'] as const).map((direction) => (
                  <SelectItem key={direction} value={direction} disabled={isFull(direction)}>
                    {DIRECTION_LABELS[direction]}
                    {isFull(direction) && ' (hudud chegarasi to‘lgan)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Nomi{isEditing && ' *'}</Label>
            <Input
              value={form.name}
              onChange={(event) => set('name', event.target.value)}
              placeholder={isEditing ? '' : 'Bo‘sh qolsa, avtomatik nom beriladi'}
              maxLength={150}
            />
          </div>

          <div className="space-y-2">
            <Label>Joylashgan joyi</Label>
            <Input
              value={form.location}
              onChange={(event) => set('location', event.target.value)}
              placeholder="Masalan: 1-qavat, asosiy kirish"
              maxLength={200}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <Label htmlFor="skud-device-active" className="cursor-pointer font-normal">
              Faol
            </Label>
            <Switch
              id="skud-device-active"
              checked={form.is_active}
              onChange={(event) => set('is_active', event.target.checked)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Bekor qilish
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Saqlash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
