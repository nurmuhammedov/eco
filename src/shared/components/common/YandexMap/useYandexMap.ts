import { useCallback, useState } from 'react';

export interface Marker {
  balloonContent?: string;
  coords: [number, number];
  hint?: string;
  id: string;
}

export const useYandexMap = (
  initialCenter: [number, number] = [41.2995, 69.2401],
) => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [center, setCenter] = useState<[number, number]>(initialCenter);
  const [zoom, setZoom] = useState<number>(10);

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
