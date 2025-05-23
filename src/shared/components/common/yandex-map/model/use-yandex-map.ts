import { useCallback, useRef, useState } from 'react';
import { Coordinate } from '../model/yandex-map-types';
import { MAP_DEFAULTS } from '../model/yandex-map-config';

export const useYandexMap = (initialCenter: Coordinate = MAP_DEFAULTS.center) => {
  const mapRef = useRef<ymaps.Map | null>(null);
  const [coords, setCoords] = useState<Coordinate[]>([]);
  const [center, setCenter] = useState<Coordinate>(initialCenter);
  const [zoom, setZoom] = useState<number>(MAP_DEFAULTS.zoom);

  const addCoord = useCallback((coord: Coordinate[]) => setCoords(coord), []);

  const updateCenter = useCallback((coord: Coordinate) => {
    setCenter(coord);
  }, []);

  const updateZoom = useCallback((zoomLevel: number) => {
    setZoom(zoomLevel);
  }, []);

  return {
    mapRef,
    coords,
    addCoord,
    center,
    zoom,
    updateCenter,
    updateZoom,
  };
};
