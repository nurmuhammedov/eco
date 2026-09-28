import { Cpu, Factory, Scan, Zap, Layers, Shapes } from 'lucide-react'

export enum InquiryBelongType {
  HF = 'HF',
  EQUIPMENT = 'EQUIPMENT',
  IRS = 'IRS',
  XRAY = 'XRAY',
  /** Not tied to any registry object */
  OTHER = 'OTHER',
}

export const inquiryTabsConfig = [
  {
    key: 'ALL',
    label: 'Barchasi',
    icon: <Layers className="h-5 w-5" />,
  },
  {
    key: InquiryBelongType.HF,
    label: 'XICHO',
    icon: <Factory className="h-5 w-5" />,
  },
  {
    key: InquiryBelongType.EQUIPMENT,
    label: 'Qurilmalar',
    icon: <Cpu className="h-5 w-5" />,
  },
  {
    key: InquiryBelongType.IRS,
    label: 'INM',
    icon: <Zap className="h-5 w-5" />,
  },
  {
    key: InquiryBelongType.XRAY,
    label: 'Rentgen',
    icon: <Scan className="h-5 w-5" />,
  },
  {
    key: InquiryBelongType.OTHER,
    label: 'Boshqalar',
    icon: <Shapes className="h-5 w-5" />,
  },
]

export type InquiryType = 'APPEAL' | 'SUGGESTION' | 'VIOLATION_REPORT'

export const appealTypeTranslations: Record<InquiryType, string> = {
  APPEAL: 'Murojaat',
  VIOLATION_REPORT: 'Huquqbuzarlik xabari',
  SUGGESTION: 'Taklif',
}

export enum InquiryStatus {
  NEW = 'NEW',
  IN_PROCESS = 'IN_PROCESS',
  UNDER_INSPECTION = 'UNDER_INSPECTION',
  IN_COURT = 'IN_COURT',
  REWARD_PAYMENT = 'REWARD_PAYMENT',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export enum InquiryAction {
  SEND_TO_COURT = 'SEND_TO_COURT',
  REJECT = 'REJECT',
  REDIRECT = 'REDIRECT',
  COMPLETE = 'COMPLETE',
}

export enum InquiryResult {
  REWARD_PAID = 'REWARD_PAID',
  REWARD_NOT_PAID = 'REWARD_NOT_PAID',
  REJECTED_BY_COURT = 'REJECTED_BY_COURT',
  REJECTED_BY_INSPECTOR = 'REJECTED_BY_INSPECTOR',
  REDIRECTED = 'REDIRECTED',
  COMPLETED_BY_INSPECTOR = 'COMPLETED_BY_INSPECTOR',
}

export const inquiryStatusLabels: Record<InquiryStatus, string> = {
  [InquiryStatus.NEW]: 'Yangi',
  [InquiryStatus.IN_PROCESS]: 'Ko‘rib chiqilmoqda',
  [InquiryStatus.UNDER_INSPECTION]: 'Tekshiruv jarayonida',
  [InquiryStatus.IN_COURT]: 'Sud jarayonida',
  [InquiryStatus.REWARD_PAYMENT]: 'Hisob jarayonida',
  [InquiryStatus.COMPLETED]: 'Yakunlangan',
  [InquiryStatus.REJECTED]: 'Rad etilgan',
}

export const inquiryStatusBadgeVariants: Record<InquiryStatus, string> = {
  [InquiryStatus.NEW]: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  [InquiryStatus.IN_PROCESS]: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  [InquiryStatus.UNDER_INSPECTION]: 'bg-teal-100 text-teal-800 hover:bg-teal-100',
  [InquiryStatus.IN_COURT]: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  [InquiryStatus.REWARD_PAYMENT]: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100',
  [InquiryStatus.COMPLETED]: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
  [InquiryStatus.REJECTED]: 'bg-red-100 text-red-800 hover:bg-red-100',
}

export const inquiryActionLabels: Record<InquiryAction, string> = {
  [InquiryAction.SEND_TO_COURT]: 'Sudga yuborish',
  [InquiryAction.REJECT]: 'Rad etish',
  [InquiryAction.REDIRECT]: 'Boshqa tashkilotga yuborish',
  [InquiryAction.COMPLETE]: 'Yakunlash',
}

export const inquiryResultLabels: Record<InquiryResult, string> = {
  [InquiryResult.REWARD_PAID]: 'Pul mukofoti to‘landi',
  [InquiryResult.REWARD_NOT_PAID]: 'Pul mukofoti to‘lanmadi',
  [InquiryResult.REJECTED_BY_COURT]: 'Sud tomonidan rad etildi',
  [InquiryResult.REJECTED_BY_INSPECTOR]: 'Inspektor tomonidan rad etildi',
  [InquiryResult.REDIRECTED]: 'Boshqa tashkilotga yuborildi',
  [InquiryResult.COMPLETED_BY_INSPECTOR]: 'Inspektor tomonidan yakunlandi',
}

export const inquiryBelongTypeLabels: Record<InquiryBelongType, string> = {
  [InquiryBelongType.HF]: 'XICHO',
  [InquiryBelongType.EQUIPMENT]: 'Qurilmalar',
  [InquiryBelongType.IRS]: 'INM',
  [InquiryBelongType.XRAY]: 'Rentgen',
  [InquiryBelongType.OTHER]: 'Boshqalar',
}

/** Where each kind of object lives in the registry; OTHER has none */
export const inquiryRegistryPath: Partial<Record<InquiryBelongType, string>> = {
  [InquiryBelongType.HF]: 'hf',
  [InquiryBelongType.EQUIPMENT]: 'equipments',
  [InquiryBelongType.IRS]: 'irs',
  [InquiryBelongType.XRAY]: 'xrays',
}
