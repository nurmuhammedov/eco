import React, { useCallback, useRef } from 'react';
import { Clusterer, Map, Placemark, YMaps } from '@pbe/react-yandex-maps';

interface Marker {
  id: string;
  coords: [number, number];
  hint?: string;
  balloonContent?: string;
}

interface YandexMapProps {
  center?: [number, number];
  enableClustering?: boolean;
  height?: string;
  markers?: Marker[];
  onMapClick?: (coords: [number, number]) => void;
  onMarkerClick?: (id: string) => void;
  width?: string;
  zoom?: number;
}

const YandexMap: React.FC<YandexMapProps> = ({
  center = [41.2995, 69.2401],
  zoom = 10,
  markers = [],
  height = '400px',
  width = '100%',
  onMapClick,
  onMarkerClick,
  enableClustering = false,
}) => {
  const mapRef = useRef<ymaps.Map | null>(null);

  const handleMapClick = useCallback(
    (e: ymaps.IEvent) => {
      const coords = e.get('coords') as [number, number];
      onMapClick?.(coords);
    },
    [onMapClick],
  );

  return (
    <YMaps
      query={{
        lang: 'en_RU',
        load: 'package.full',
        apikey: '5e5bbce4-d5fd-4a66-80ae-db0578837b3a',
      }}
    >
      <Map
        width={width}
        height={height}
        onClick={handleMapClick}
        defaultState={{ center, zoom }}
        instanceRef={(ref) => (mapRef.current = ref)}
      >
        {enableClustering ? (
          <Clusterer options={{ preset: 'islands#invertedVioletClusterIcons' }}>
            {markers.map(({ id, coords, hint, balloonContent }) => (
              <Placemark
                key={id}
                geometry={coords}
                properties={{ hintContent: hint, balloonContent }}
                options={{ preset: 'islands#redDotIcon' }}
                onClick={() => onMarkerClick?.(id)}
              />
            ))}
          </Clusterer>
        ) : (
          markers.map(({ id, coords, hint, balloonContent }) => (
            <Placemark
              key={id}
              geometry={coords}
              properties={{ hintContent: hint, balloonContent }}
              options={{ preset: 'islands#blueDotIcon' }}
              onClick={() => onMarkerClick?.(id)}
            />
          ))
        )}
      </Map>
    </YMaps>
  );
};

export default React.memo(YandexMap);
