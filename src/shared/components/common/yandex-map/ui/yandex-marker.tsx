import React from 'react';
import { Coordinate } from '../model/yandex-map-types.ts';
import { Placemark } from '@pbe/react-yandex-maps';

interface YandexMarkerProps {
  coordinate: Coordinate;
  onClick?: (id: string) => void;
}

export const YandexMarker: React.FC<YandexMarkerProps> = ({ coordinate }) => {
  return (
    <Placemark
      geometry={coordinate}
      options={{ preset: 'islands#blueDotIcon' }}
    />
  );
};
