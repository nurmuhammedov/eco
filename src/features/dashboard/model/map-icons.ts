import { FacilityLocation, RISK_STYLE, STATUS_STYLE, markerColor } from './facility-location'

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

export const facilityIconOptions = (facility: FacilityLocation) => ({
  iconLayout: 'default#image',
  iconImageHref: markerIcon(markerColor(facility)),
  iconImageSize: [18, 18],
  iconImageOffset: [-9, -9],
  // The pie-chart cluster reads this to colour the slice each object adds.
  iconColor: markerColor(facility),
})

export type RiskKey = 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE'

export const RISK_FILTERS: { key: RiskKey; label: string; color: string }[] = [
  { key: 'HIGH', label: RISK_STYLE.HIGH.label, color: RISK_STYLE.HIGH.color },
  { key: 'MEDIUM', label: RISK_STYLE.MEDIUM.label, color: RISK_STYLE.MEDIUM.color },
  { key: 'LOW', label: RISK_STYLE.LOW.label, color: RISK_STYLE.LOW.color },
  { key: 'NONE', label: 'Tahlil qilinmagan', color: STATUS_STYLE.VALID.color },
]

export const riskKeyOf = (facility: FacilityLocation): RiskKey => facility.riskLevel ?? 'NONE'
