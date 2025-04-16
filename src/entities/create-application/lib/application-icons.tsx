export const ApplicationIcons = {
  documentAdd: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path
        d="M8 2v4h8V2M3 6v16h18V6H3z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 14h6m-3-3v6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  documentRemove: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path
        d="M8 2v4h8V2M3 6v16h18V6H3z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 14h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  documentRefresh: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path
        d="M8 2v4h8V2M3 6v16h18V6H3z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 12h6M9 16h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M16 9c-1.5-1.5-3.5-1.5-5 0s-1.5 3.5 0 5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  chemicalVessel: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path
        d="M9 3v5l-3 2v8a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-8l-3-2V3H9z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6 10h12M9 3h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M9 14h.01M12 16h.01M15 14h.01M12 12h.01"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  pressureVessel: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M8 3h8M12 3v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 9c0-1.7 2.7-3 6-3s6 1.3 6 3v7c0 1.7-2.7 3-6 3s-6-1.3-6-3V9z" stroke={color} strokeWidth="1.5" />
      <path d="M6 13h12M6 17h12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  gasVessel: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M8 4h8M12 4v3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M7 7c0-1 2.25-2 5-2s5 1 5 2v9c0 1.66-2.25 3-5 3s-5-1.34-5-3V7z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7 12h10M7 16h10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M16 9c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zM10 9c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1z"
        fill={color}
      />
    </svg>
  ),
  recycleBoiler: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M7 8a5 5 0 0110 0v6a5 5 0 01-10 0V8z" stroke={color} strokeWidth="1.5" />
      <path d="M7 12h10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 4v2M15 4v2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M5 20l2.5-3M19 20l-2.5-3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 21h8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 16l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  boiler: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M9 3v4M15 3v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 8a5 5 0 0110 0v8a5 5 0 01-10 0V8z" stroke={color} strokeWidth="1.5" />
      <path d="M7 12h10M7 16h10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 20v2M14 20v2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 10v6" stroke={color} strokeWidth="1.5" strokeDasharray="0.5 2" />
    </svg>
  ),
  elevator: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <rect x="5" y="2" width="14" height="20" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M5 12h14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 7l3-3 3 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 17l3 3 3-3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  escalator: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M7 7h3v4h4v4h3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 17h10M7 7h10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  attraction: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M6 6l1.5 1.5M16.5 16.5L18 18M6 18l1.5-1.5M16.5 7.5L18 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  crane: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M4 4h16M12 4v8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 4v6h-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 12h8l-4 4-4-4z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9" y="16" width="6" height="4" rx="1" stroke={color} strokeWidth="1.5" />
    </svg>
  ),
  pipeSystem: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M3 6h18M3 12h18M3 18h18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 6v6M17 12v6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M12 6a3 3 0 100-6 3 3 0 000 6zM12 24a3 3 0 100-6 3 3 0 000 6z"
        fill={`${color}20`}
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  ),
  passport: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path
        d="M4 4v16a2 2 0 002 2h12a2 2 0 002-2V8.342a2 2 0 00-.602-1.43l-4.364-4.536A2 2 0 0013.364 2H6a2 2 0 00-2 2z"
        stroke={color}
        strokeWidth="1.5"
      />
      <path d="M9 13a3 3 0 106 0 3 3 0 00-6 0z" stroke={color} strokeWidth="1.5" />
      <path d="M9 19c0-1.5 1.5-3 3-3s3 1.5 3 3" stroke={color} strokeWidth="1.5" />
    </svg>
  ),
  cableway: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M3 6h18M3 18h18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 6l3 6M18 6l-3 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 18l3-6M18 18l-3-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9" y="10" width="6" height="4" rx="1" stroke={color} strokeWidth="1.5" />
    </svg>
  ),
  steamPipe: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M3 6h18M3 12h18M3 18h18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 6v6M17 12v6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 6c0-1.1.9-2 2-2s2 .9 2 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 18c0 1.1.9 2 2 2s2-.9 2-2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 6v6m0 6v-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="0.5 2" />
    </svg>
  ),
  naturalGas: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path
        d="M8 4c0 1.5 1.5 2 1.5 3.5S8 10 8 12c0 3 2 4 4 4s4-1 4-4c0-2-1.5-3-1.5-4.5S16 5.5 16 4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 19h4M12 16v3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 10h12M6 14h12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 2" />
    </svg>
  ),
  heavyLift: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M5 5v14M19 5v14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 4v16M15 4v16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 12h14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 5h4M3 19h4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 5h4M17 19h4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};
