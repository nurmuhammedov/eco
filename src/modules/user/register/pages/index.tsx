import { lazy } from 'react';
import { useYandexMap } from '@/shared/components/common/YandexMap';

const YandexMap = lazy(
  () => import('@/shared/components/common/YandexMap/YandexMap'),
);

export default function Index() {
  const { markers, addMarker, removeMarker, center, zoom } = useYandexMap();

  return (
    <div>
      <YandexMap
        center={center}
        zoom={zoom}
        markers={markers}
        onMapClick={(coords) => addMarker(coords)}
        onMarkerClick={removeMarker}
        height="500px"
        width="100%"
      />
    </div>
  );
}
