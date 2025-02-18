import { useYandexMap, YandexMap } from '@/shared/components/common/yandex-map';

export default function Index() {
  const { markers, addMarker, removeMarker, center, zoom } = useYandexMap();

  return (
    <YandexMap
      zoom={zoom}
      width="100%"
      height="500px"
      center={center}
      markers={markers}
      onMarkerClick={removeMarker}
      onMapClick={(coords) => addMarker(coords)}
    />
  );
}
