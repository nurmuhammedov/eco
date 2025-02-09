import React from 'react';

export interface Marker {
  id: string;
  coords: [number, number];
  hint?: string;
  balloonContent?: string;
}

export interface YandexMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Marker[];
  enableClustering?: boolean;
  width?: string;
  height?: string;
}

export type YMapRef = React.MutableRefObject<ymaps.Map | null>;
