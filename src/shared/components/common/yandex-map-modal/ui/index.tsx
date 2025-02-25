import { MapPinned } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Coordinate, YandexMap } from '@/shared/components/common/yandex-map';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { MAP_DEFAULTS } from '@/shared/components/common/yandex-map/model/yandex-map-config.ts';
import { getMapContentSize } from '@/shared/components/common/yandex-map-modal/lib';

interface YandexMapModalProps {
  label?: string;
  initialCoords?: Coordinate;
  onConfirm: (coords: Coordinate) => void;
}

const YandexMapModal: React.FC<YandexMapModalProps> = ({
  label = 'Харитадан белгилаш',
  onConfirm,
  initialCoords,
}) => {
  const mapHeight = getMapContentSize();
  const [open, setOpen] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<Coordinate | null>(
    initialCoords || null,
  );

  useEffect(() => {
    if (open && initialCoords) {
      setSelectedCoords(initialCoords);
    }
  }, [open, initialCoords]);

  const handleMapClick = useCallback((coords: Coordinate[]) => {
    if (coords.length > 0) {
      setSelectedCoords(coords[0]);
    }
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedCoords) {
      onConfirm(selectedCoords);
      setOpen(false);
    }
  }, [selectedCoords, onConfirm]);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between text-neutral-350"
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
            <DialogTitle>Харитадан манзилни белгиланг</DialogTitle>
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
                Бекор қилиш
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleConfirm} disabled={!selectedCoords}>
                Сақлаш
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default React.memo(YandexMapModal);
