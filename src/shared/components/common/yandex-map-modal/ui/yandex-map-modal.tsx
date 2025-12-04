import { MapPinned } from 'lucide-react'
import { getMapContentSize } from '../lib'
import { Button } from '@/shared/components/ui/button'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Coordinate, YandexMap } from '@/shared/components/common/yandex-map'
import { MAP_DEFAULTS } from '@/shared/components/common/yandex-map/model/yandex-map-config'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { cn } from '@/shared/lib/utils.ts'

interface YandexMapModalProps {
  label?: string
  initialCoords?: any
  onConfirm: (coords: string) => void
}

const YandexMapModal: React.FC<YandexMapModalProps> = ({ label = 'Xaritadan belgilash', onConfirm, initialCoords }) => {
  const mapHeight = getMapContentSize()
  const [open, setOpen] = useState(false)
  const [selectedCoords, setSelectedCoords] = useState<Coordinate | null>(initialCoords || null)

  useEffect(() => {
    if (open && initialCoords) {
      setSelectedCoords(initialCoords)
    }
  }, [open, initialCoords])

  const handleMapClick = useCallback((coords: Coordinate[]) => {
    if (coords.length > 0) {
      setSelectedCoords(coords[0])
    }
  }, [])

  const handleConfirm = useCallback(() => {
    if (selectedCoords) {
      onConfirm(selectedCoords.join(', '))
      setOpen(false)
    }
  }, [selectedCoords, onConfirm])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn('w-full justify-between', {
            'text-neutral-350': !selectedCoords?.length,
          })}
        >
          {selectedCoords?.length ? (
            selectedCoords.join(', ')
          ) : (
            <Fragment>
              {label} <MapPinned />
            </Fragment>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-9/10">
        <DialogHeader>
          <DialogTitle>Xaritadan joylashuvni belgilang</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <YandexMap
            zoom={12}
            width="100%"
            height={mapHeight}
            onMapClick={handleMapClick}
            center={selectedCoords || MAP_DEFAULTS.center}
            coords={selectedCoords ? [selectedCoords] : []}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Bekor qilish
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleConfirm} disabled={!selectedCoords}>
              Saqlash
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default React.memo(YandexMapModal)
