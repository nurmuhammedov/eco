export type Coordinate = [number, number];

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
  coords?: Coordinate[];
  center?: [number, number];
  onMapClick?: (coords: Coordinate[]) => void;
}
