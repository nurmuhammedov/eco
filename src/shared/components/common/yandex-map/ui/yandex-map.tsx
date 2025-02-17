import React, { useCallback, useRef } from 'react';
import { MAP_DEFAULTS } from '../model/yandex-map-config';
import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';
import type { YandexMapProps } from '../model/yandex-map-types';

const YandexMap: React.FC<YandexMapProps> = ({
  onMapClick,
  markers = [],
  onMarkerClick,
  zoom = MAP_DEFAULTS.zoom,
  width = MAP_DEFAULTS.width,
  height = MAP_DEFAULTS.height,
  center = MAP_DEFAULTS.center,
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
        {markers.map(({ id, coords, hint, balloonContent }) => (
          <Placemark
            key={id}
            geometry={coords}
            options={{ preset: 'islands#blueDotIcon' }}
            onClick={() => onMarkerClick?.(id)}
            properties={{ hintContent: hint, balloonContent }}
          />
        ))}
      </Map>
    </YMaps>
  );
};

export default React.memo(YandexMap);
