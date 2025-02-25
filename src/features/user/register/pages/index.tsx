import { useYandexMap, YandexMap } from '@/shared/components/common/yandex-map';

export default function Index() {
  const { coords, addCoord, center, zoom } = useYandexMap();

  return (
    <YandexMap
      zoom={zoom}
      width="100%"
      height="500px"
      center={center}
      coords={coords}
      onMapClick={(coords) => addCoord(coords)}
    />
  );
}
