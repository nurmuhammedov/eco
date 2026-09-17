import {
  Archive,
  ArrowDownUp,
  BadgeCheck,
  BarChart2,
  Building2,
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
import { ReactNode } from 'react'

/**
 * One icon per module, listed once. The cabinets used to carry their own copy
 * of the menu, so the same section could appear with a different icon depending
 * on who signed in, and two unrelated sections could share one.
 */
export const MODULE_ICONS: Record<string, ReactNode> = {
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
  USER_DELEGATION: <UsersRound />,
}
