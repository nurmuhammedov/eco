import React from 'react';

export interface Marker {
  id: string;
  hint?: string;
  balloonContent?: string;
  coords: [number, number];
}

export interface YandexMapProps {
  zoom?: number;
  width?: string;
  height?: string;
  markers?: Marker[];
  center?: [number, number];
  onMarkerClick?: (id: string) => void;
  onMapClick?: (coords: [number, number]) => void;
}

export type YMapRef = React.MutableRefObject<ymaps.Map | null>;
