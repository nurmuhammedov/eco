export interface Marker {
  id: string;
  hint?: string;
  balloonContent?: string;
  coords: [number, number];
}

export interface YandexMapProps {
  zoom?: number;
  width?: string;
  markers?: Marker[];
  height?: number | string;
  center?: [number, number];
  onMarkerClick?: (id: string) => void;
  onMapClick?: (coords: [number, number]) => void;
}
