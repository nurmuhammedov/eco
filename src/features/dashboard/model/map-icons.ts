import { MapPoint, pointColor } from './map-layers'

/**
 * A filled disc rather than Yandex's ring preset: at country zoom the ring's
 * white centre washes the colour out, and colour is the whole point here.
 * Encoded as a data URI so the map needs no extra request per marker.
 */
export const markerIcon = (color: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
<circle cx="9" cy="9" r="7" fill="${color}" stroke="#ffffff" stroke-width="2"/>
</svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export const pointIconOptions = (point: MapPoint) => {
  const color = pointColor(point)

  return {
    iconLayout: 'default#image',
    iconImageHref: markerIcon(color),
    iconImageSize: [18, 18],
    iconImageOffset: [-9, -9],
    // The pie-chart cluster reads this to colour the slice each object adds.
    iconColor: color,
  }
}
