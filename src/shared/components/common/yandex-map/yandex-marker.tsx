import React from 'react';
import { Marker } from './types';
import { Placemark } from '@pbe/react-yandex-maps';

interface YandexMarkerProps {
  marker: Marker;
  onClick?: (id: string) => void;
}

export const YandexMarker: React.FC<YandexMarkerProps> = ({
  marker,
  onClick,
}) => {
  return (
    <Placemark
      geometry={marker.coords}
      properties={{
        hintContent: marker.hint,
        balloonContent: marker.balloonContent,
      }}
      options={{ preset: 'islands#blueDotIcon' }}
      onClick={() => onClick?.(marker.id)}
    />
  );
};
