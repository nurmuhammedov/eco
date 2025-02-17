import { useCallback, useState } from 'react';
import { MAP_DEFAULTS } from './yandex-map-config';

export interface Marker {
  id: string;
  hint?: string;
  balloonContent?: string;
  coords: [number, number];
}

export const useYandexMap = (
  initialCenter: [number, number] = MAP_DEFAULTS.center,
) => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [center, setCenter] = useState<[number, number]>(initialCenter);
  const [zoom, setZoom] = useState<number>(MAP_DEFAULTS.zoom);

  const addMarker = useCallback((coords: [number, number]) => {
    setMarkers((prev) => [...prev, { id: Date.now().toString(), coords }]);
  }, []);

  const removeMarker = useCallback((id: string) => {
    setMarkers((prev) => prev.filter((marker) => marker.id !== id));
  }, []);

  const updateCenter = useCallback((coords: [number, number]) => {
    setCenter(coords);
  }, []);

  const updateZoom = useCallback((zoomLevel: number) => {
    setZoom(zoomLevel);
  }, []);

  return {
    markers,
    addMarker,
    removeMarker,
    center,
    zoom,
    updateCenter,
    updateZoom,
  };
};
