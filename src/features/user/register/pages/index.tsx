import { lazy } from 'react';
import { useYandexMap } from '@/shared/components/common/yandex-map';

const YandexMap = lazy(
  () => import('@/shared/components/common/yandex-map/ui/yandex-map'),
);

export default function Index() {
  const { markers, addMarker, removeMarker, center, zoom } = useYandexMap();

  return (
    <div>
      <YandexMap
        zoom={zoom}
        width="100%"
        height="500"
        center={center}
        markers={markers}
        onMarkerClick={removeMarker}
        onMapClick={(coords) => addMarker(coords)}
      />
    </div>
  );
}
