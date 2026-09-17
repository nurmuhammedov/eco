import { ReactElement } from 'react'
import {
  Archive,
  ArrowDownUp,
  BadgeCheck,
  BarChart2,
  Building2,
  CalendarClock,
  ClipboardList,
  Database,
  FileBadge,
  FileCheck,
  FileText,
  Gauge,
  LandPlot,
  MessageSquareText,
  Newspaper,
  PieChart,
  ScrollText,
  ShieldCheck,
  Siren,
  Stamp,
  UsersRound,
} from 'lucide-react'

/**
 * One icon per module, listed once. The cabinets used to carry their own copy
 * of the menu, so the same section could appear with a different icon depending
 * on who signed in, and two unrelated sections could share one.
 *
 * The keys are literal rather than `string`, so a menu asking for an icon this
 * map does not carry is a compile error instead of a blank space.
 */
export const MODULE_ICONS = {
  APPEAL: <FileText />,
  REGISTRY: <Database />,
  ELEVATOR: <ArrowDownUp />,
  PREVENTION: <ShieldCheck />,
  RISK_ANALYSIS: <Gauge />,
  INSPECTION: <ClipboardList />,
  ACCREDITATION: <Stamp />,
  ORGANIZATIONS: <Building2 />,
  CONCLUSION: <FileCheck />,
  DECLARATION: <ScrollText />,
  REPORT: <BarChart2 />,
  PERMITS: <FileBadge />,
  INQUIRY: <MessageSquareText />,
  ACCIDENT: <Siren />,
  ANNOUNCEMENT: <Newspaper />,
  ARCHIVE: <Archive />,
  CADASTRE_PASSPORT: <LandPlot />,
  KPI: <PieChart />,
  ATTESTATION: <BadgeCheck />,
  DELEGATION: <UsersRound />,
  TURNIKET_LOGS: <CalendarClock />,
} as const satisfies Record<string, ReactElement>
