import { Cpu, Factory, Scan, Zap, Layers } from 'lucide-react'

export enum InquiryBelongType {
  HF = 'HF',
  EQUIPMENT = 'EQUIPMENT',
  IRS = 'IRS',
  XRAY = 'XRAY',
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
]

export const appealTypeTranslations: Record<string, string> = {
  APPEAL: 'Murojaat',
  RISK_APPEAL: 'Huquqbuzarliik xabari',
  SUGGESTION: 'Taklif',
}

export enum InquiryStatus {
  NEW = 'NEW', // Yangi
  IN_PROCESS = 'IN_PROCESS', // Ko'rib chiqilmoqda
  IN_COURT = 'IN_COURT', // Sud jarayonida
  REWARD_PAYMENT = 'REWARD_PAYMENT', // Pul mukofotini to'lov qilishda
  COMPLETED = 'COMPLETED', // Yakunlangan
  REJECTED = 'REJECTED', // Rad etilgan
}

export enum InquiryAction {
  SEND_TO_COURT = 'SEND_TO_COURT', // Sudga yuborildi
  REJECT = 'REJECT', // Rad etildi
  REDIRECT = 'REDIRECT', // Boshqa tashkilotga yuborildi
  COMPLETE = 'COMPLETE', // Yakunlandi
}

export enum InquiryResult {
  REWARD_PAID = 'REWARD_PAID', // Pul mukofoti to'landi
  REWARD_NOT_PAID = 'REWARD_NOT_PAID', // Pul mukofoti to'lanmadi
  REJECTED_BY_COURT = 'REJECTED_BY_COURT', // Sud tomonidan rad etildi
  REJECTED_BY_INSPECTOR = 'REJECTED_BY_INSPECTOR', // Inspector tomonidan rad etildi
  REDIRECTED = 'REDIRECTED', // Boshqa tashkilotga yuborildi
  COMPLETED_BY_INSPECTOR = 'COMPLETED_BY_INSPECTOR', // Inspektor tomonidan yakunlandi
}

export const inquiryStatusLabels: Record<InquiryStatus | string, string> = {
  [InquiryStatus.NEW]: 'Yangi',
  [InquiryStatus.IN_PROCESS]: 'Ko‘rib chiqilmoqda',
  [InquiryStatus.IN_COURT]: 'Sud jarayonida',
  [InquiryStatus.REWARD_PAYMENT]: 'Hisob jarayonida',
  [InquiryStatus.COMPLETED]: 'Yakunlangan',
  [InquiryStatus.REJECTED]: 'Rad etilgan',
}

export const inquiryStatusBadgeVariants: Record<InquiryStatus | string, string> = {
  [InquiryStatus.NEW]: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  [InquiryStatus.IN_PROCESS]: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  [InquiryStatus.IN_COURT]: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  [InquiryStatus.REWARD_PAYMENT]: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100',
  [InquiryStatus.COMPLETED]: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
  [InquiryStatus.REJECTED]: 'bg-red-100 text-red-800 hover:bg-red-100',
}

export const inquiryActionLabels: Record<InquiryAction | string, string> = {
  [InquiryAction.SEND_TO_COURT]: 'Sudga yuborish',
  [InquiryAction.REJECT]: 'Rad etish',
  [InquiryAction.REDIRECT]: 'Boshqa tashkilotga yuborish',
  [InquiryAction.COMPLETE]: 'Yakunlash',
}

export const inquiryResultLabels: Record<InquiryResult | string, string> = {
  [InquiryResult.REWARD_PAID]: 'Pul mukofoti to‘landi',
  [InquiryResult.REWARD_NOT_PAID]: 'Pul mukofoti to‘lanmadi',
  [InquiryResult.REJECTED_BY_COURT]: 'Sud tomonidan rad etildi',
  [InquiryResult.REJECTED_BY_INSPECTOR]: 'Inspektor tomonidan rad etildi',
  [InquiryResult.REDIRECTED]: 'Boshqa tashkilotga yuborildi',
  [InquiryResult.COMPLETED_BY_INSPECTOR]: 'Inspektor tomonidan yakunlandi',
}

export const inquiryBelongTypeLabels: Record<string, string> = {
  [InquiryBelongType.HF]: 'XICHO',
  [InquiryBelongType.EQUIPMENT]: 'Qurilmalar',
  [InquiryBelongType.IRS]: 'INM',
  [InquiryBelongType.XRAY]: 'Rentgen',
}
