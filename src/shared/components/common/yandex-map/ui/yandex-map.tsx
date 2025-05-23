import React, { useCallback, useRef } from 'react';
import { MAP_DEFAULTS } from '../model/yandex-map-config';
import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';
import type { Coordinate, YandexMapProps } from '../model/yandex-map-types';

const YandexMap: React.FC<YandexMapProps> = ({
  onMapClick,
  coords = [],
  zoom = MAP_DEFAULTS.zoom,
  width = MAP_DEFAULTS.width,
  height = MAP_DEFAULTS.height,
  center = MAP_DEFAULTS.center,
}) => {
  const mapRef = useRef<ymaps.Map | null>(null);

  const handleMapClick = useCallback(
    (e: ymaps.IEvent) => {
      const coords = e.get('coords') as Coordinate;
      onMapClick?.([coords]);
    },
    [onMapClick],
  );

  return (
    <YMaps>
      <Map
        width={width}
        height={height}
        onClick={handleMapClick}
        defaultState={{ center, zoom }}
        instanceRef={(ref) => (mapRef.current = ref)}
      >
        {coords.map((coordinate, index) => (
          <Placemark key={index} geometry={coordinate} options={{ preset: 'islands#blueDotIcon' }} />
        ))}
      </Map>
    </YMaps>
  );
};

export default React.memo(YandexMap);
